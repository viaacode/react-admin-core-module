import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	forwardRef,
	Inject,
	InternalServerErrorException,
	Logger,
	Post,
	UnauthorizedException,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Avo } from '@viaa/avo2-types';
import { AssetType, PermissionName } from '@viaa/avo2-types';
import { DataService } from '../../data';
import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator';
import { SessionUser } from '../../shared/decorators/user.decorator';
import {
	DeleteContentAssetDocument,
	DeleteContentAssetMutation,
	DeleteContentAssetMutationVariables,
	GetContentAssetOwnerIdDocument,
	GetContentAssetOwnerIdQuery,
	GetContentAssetOwnerIdQueryVariables,
	InsertContentAssetDocument,
	InsertContentAssetMutation,
	InsertContentAssetMutationVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { LoggedInGuard } from '../../shared/guards/logged-in.guard';
import { TranslationsService } from '../../translations';
import { SessionUserEntity } from '../../users/classes/session-user';
import { VALID_MIME_TYPES } from '../assets.consts';
import { DeleteAssetDto } from '../dto/assets.dto';
import { AssetsService } from '../services/assets.service';

// TODO use this assets service also for the HetArchief site instead of the hetarchief own assets service
// Advantages:
// Content page service can handle assets as well
// Uploaded assets are also tracked in the database in the app_content_assets table
@UseGuards(LoggedInGuard)
@ApiTags('Assets')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/assets')
@RequireAnyPermissions(PermissionName.EDIT_ANY_CONTENT_PAGES, PermissionName.EDIT_OWN_CONTENT_PAGES)
export class AssetsController {
	private logger: Logger = new Logger(AssetsController.name, { timestamp: true });

	constructor(
		private assetsService: AssetsService,
		private translationsService: TranslationsService,
		@Inject(forwardRef(() => DataService)) protected dataService: DataService
	) {}

	/**
	 * Upload a file to the asset server and track it in the asset table in graphql
	 */
	@Post('upload')
	@UseInterceptors(FileInterceptor('content'))
	@ApiOperation({
		description: 'Upload a file and get back a url',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@UseGuards(LoggedInGuard)
	@RequireAnyPermissions(
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	async uploadAsset(
		@UploadedFile() file: any,
		@Body() uploadAssetInfo: Avo.FileUpload.UploadAssetInfo
	): Promise<{ url: string }> {
		if (!file) {
			throw new BadRequestException(
				this.translationsService.t(
					'modules/assets/controllers/assets___the-request-should-contain-a-file-to-upload'
				)
			);
		}
		if (!this.isValidFileType(file)) {
			throw new BadRequestException({
				message: 'Invalid file extension',
				additionalInfo: { mimetype: file.mimetype },
			});
		}

		try {
			const url = await this.assetsService.upload(AssetType.CONTENT_PAGE_IMAGE, file);
			const asset = {
				owner_id: uploadAssetInfo.ownerId,
				content_asset_type_id: uploadAssetInfo.type,
				label: url,
				description: null as string | null,
				path: url,
			};
			await this.dataService.execute<
				InsertContentAssetMutation,
				InsertContentAssetMutationVariables
			>(InsertContentAssetDocument, {
				asset,
			});
			return {
				url,
			};
		} catch (err) {
			const error = new InternalServerErrorException({
				message: 'Failed to upload file to asset server',
				innerException: err,
				additionalInfo: {
					file: {
						...file,
						buffer: '<<omitted>>',
					},
				},
			});
			this.logger.error(error);
			throw error;
		}
	}

	/**
	 * Duplicate asset entry and keep a record of the duplicate in graphql
	 * @param url
	 * @param ownerId
	 */
	async duplicate(url: string, ownerId: string): Promise<string> {
		const assetInfo = await this.info(url);
		const duplicateUrl = await this.assetsService.copy(url);

		const asset = {
			owner_id: ownerId,
			content_asset_type_id: assetInfo.content_asset_type_id,
			label: duplicateUrl,
			description: null as string | null,
			path: duplicateUrl,
		};
		await this.dataService.execute<
			InsertContentAssetMutation,
			InsertContentAssetMutationVariables
		>(InsertContentAssetDocument, {
			asset,
		});

		return duplicateUrl;
	}

	isValidFileType(file: { mimetype: string }): boolean {
		return VALID_MIME_TYPES.includes(file.mimetype);
	}

	async info(url: string): Promise<GetContentAssetOwnerIdQuery['app_content_assets'][0]> {
		try {
			const response = await this.dataService.execute<
				GetContentAssetOwnerIdQuery,
				GetContentAssetOwnerIdQueryVariables
			>(GetContentAssetOwnerIdDocument, {
				url,
			});
			return response.app_content_assets?.[0];
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to fetch asset info from the graphql database',
				innerException: err,
				additionalInfo: { url },
			});
		}
	}

	/**
	 * Delete a file from the asset server and remove it from the asset table in graphql
	 */
	@Delete('delete')
	@UseGuards(LoggedInGuard)
	async deleteAsset(
		@Body() deleteAssetDto: DeleteAssetDto,
		@SessionUser() user: SessionUserEntity
	): Promise<{ status: 'deleted' } | BadRequestException> {
		try {
			if (!(await this.hasPermissionToDeleteAsset(deleteAssetDto.url, user))) {
				throw new UnauthorizedException('You are not allowed to delete this file');
			}
			await this.assetsService.delete(deleteAssetDto.url);
			await this.dataService.execute<
				DeleteContentAssetMutation,
				DeleteContentAssetMutationVariables
			>(DeleteContentAssetDocument, { url: deleteAssetDto.url });
			return { status: 'deleted' };
		} catch (err) {
			const error = new InternalServerErrorException({
				message: 'Failed to delete asset file',
				innerException: err,
				additionalInfo: {
					body: deleteAssetDto,
				},
			});
			this.logger.error(error);
			throw error;
		}
	}

	private async hasPermissionToDeleteAsset(url: string, @SessionUser() user: SessionUserEntity) {
		const assetInfo = await this.info(url);
		if (!assetInfo) {
			throw new BadRequestException('The requested file was not found in the avo database');
		}
		if (assetInfo.owner_id === user.getProfileId()) {
			return true;
		}
		if (
			assetInfo.content_asset_type_id === AssetType.BUNDLE_COVER &&
			user.hasAny([PermissionName.EDIT_OWN_BUNDLES, PermissionName.EDIT_ANY_BUNDLES])
		) {
			return true;
		}
		if (
			assetInfo.content_asset_type_id === AssetType.COLLECTION_COVER &&
			user.hasAny([PermissionName.EDIT_OWN_COLLECTIONS, PermissionName.EDIT_ANY_COLLECTIONS])
		) {
			return true;
		}
		if (
			[
				AssetType.CONTENT_PAGE_COVER,
				AssetType.CONTENT_BLOCK_FILE,
				AssetType.CONTENT_BLOCK_IMAGE,
				AssetType.CONTENT_PAGE_DESCRIPTION_IMAGE,
			].includes(assetInfo.content_asset_type_id as AssetType) &&
			user.hasAny([
				PermissionName.EDIT_OWN_CONTENT_PAGES,
				PermissionName.EDIT_ANY_CONTENT_PAGES,
			])
		) {
			return true;
		}
		if (
			assetInfo.content_asset_type_id === AssetType.ASSIGNMENT_DESCRIPTION_IMAGE &&
			user.hasAny([PermissionName.EDIT_OWN_ASSIGNMENTS, PermissionName.EDIT_ANY_ASSIGNMENTS])
		) {
			return true;
		}
		if (
			assetInfo.content_asset_type_id === AssetType.INTERACTIVE_TOUR_IMAGE &&
			user.hasAny([PermissionName.EDIT_INTERACTIVE_TOURS])
		) {
			return true;
		}
		if (
			[AssetType.ITEM_SUBTITLE, AssetType.ITEM_NOTE_IMAGE].includes(
				assetInfo.content_asset_type_id as AssetType
			) &&
			user.hasAny([PermissionName.VIEW_ITEMS_OVERVIEW])
		) {
			return true;
		}
		return false;
	}
}