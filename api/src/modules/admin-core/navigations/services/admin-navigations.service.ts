import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';

import {
	CreateNavigationDto,
	NavigationsQueryDto,
} from '../dto/navigations.dto';
import { Navigation } from '../types';

import {
	DeleteNavigationDocument,
	DeleteNavigationMutation,
	DeleteNavigationMutationVariables,
	FindAllNavigationItemsDocument,
	FindAllNavigationItemsQuery,
	FindNavigationByIdDocument,
	FindNavigationByIdQuery,
	FindNavigationByIdQueryVariables,
	FindNavigationByPlacementDocument,
	FindNavigationByPlacementQuery,
	FindNavigationByPlacementQueryVariables,
	InsertNavigationDocument,
	InsertNavigationMutation,
	InsertNavigationMutationVariables,
	UpdateNavigationByIdDocument,
	UpdateNavigationByIdMutation,
	UpdateNavigationByIdMutationVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { DataService } from '../../data/services/data.service';
import { NavigationItem } from '../types';
import { DeleteResponse } from '../../shared/types/types';

@Injectable()
export class AdminNavigationsService {
	private logger: Logger = new Logger(AdminNavigationsService.name, {
		timestamp: true,
	});

	constructor(private dataService: DataService) {}

	public adapt(navigationItem: Navigation): NavigationItem {
		/* istanbul ignore next */
		return {
			id: navigationItem?.id,
			label: navigationItem?.label,
			placement: navigationItem?.placement,
			description: navigationItem?.description,
			linkTarget: navigationItem?.link_target,
			iconName: navigationItem?.icon_name,
			position: navigationItem?.position,
			contentType: navigationItem?.content_type,
			contentPath: navigationItem?.content_path,
			tooltip: navigationItem?.tooltip,
			updatedAt: navigationItem?.updated_at,
			createdAt: navigationItem?.created_at,
		};
	}

	public async createElement(
		navigationItem: CreateNavigationDto,
	): Promise<InsertNavigationMutation['insert_app_navigation_one']> {
		const response = await this.dataService.execute<
			InsertNavigationMutation,
			InsertNavigationMutationVariables
		>(InsertNavigationDocument, {
			navigationItem,
		});
		this.logger.debug(
			`Navigation ${response.insert_app_navigation_one.id} created`,
		);

		return response.insert_app_navigation_one;
	}

	public async updateElement(
		id: string,
		navigationItem: CreateNavigationDto,
	): Promise<UpdateNavigationByIdMutation['update_app_navigation_by_pk']> {
		const response = await this.dataService.execute<
			UpdateNavigationByIdMutation,
			UpdateNavigationByIdMutationVariables
		>(UpdateNavigationByIdDocument, {
			id,
			navigationItem,
		});
		this.logger.debug(
			`Navigation ${response.update_app_navigation_by_pk.id} updated`,
		);

		return response.update_app_navigation_by_pk;
	}

	public async deleteElement(id: string): Promise<DeleteResponse> {
		const response = await this.dataService.execute<
			DeleteNavigationMutation,
			DeleteNavigationMutationVariables
		>(DeleteNavigationDocument, {
			id,
		});

		return {
			affectedRows: response.delete_app_navigation.affected_rows,
		};
	}

	public async findAllNavigationBars(
		navigationsQueryDto: NavigationsQueryDto,
	): Promise<IPagination<Navigation>> {
		const { placement } = navigationsQueryDto;
		let navigationsResponse:
			| FindNavigationByPlacementQuery
			| FindAllNavigationItemsQuery;
		if (placement) {
			navigationsResponse = await this.dataService.execute<
				FindNavigationByPlacementQuery,
				FindNavigationByPlacementQueryVariables
			>(FindNavigationByPlacementDocument, {
				placement,
			});
		} else {
			navigationsResponse =
				await this.dataService.execute<FindAllNavigationItemsQuery>(
					FindAllNavigationItemsDocument,
				);
		}

		return Pagination<Navigation>({
			items: navigationsResponse.app_navigation,
			page: 1,
			size: navigationsResponse.app_navigation.length,
			total: navigationsResponse.app_navigation.length,
		});
	}

	public async findElementById(id: string): Promise<Navigation> {
		const navigationResponse = await this.dataService.execute<
			FindNavigationByIdQuery,
			FindNavigationByIdQueryVariables
		>(FindNavigationByIdDocument, { id });
		if (!navigationResponse.app_navigation?.[0]) {
			throw new NotFoundException();
		}
		return navigationResponse.app_navigation?.[0];
	}
}
