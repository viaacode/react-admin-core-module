import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { DataService } from '../../data';
import { getDatabaseType } from '../../shared/helpers/get-database-type';
import { DeleteResponse } from '../../shared/types/types';
import { CreateNavigationDto } from '../dto/navigations.dto';
import { NavigationItem } from '../navigations.types';
import {
	NAVIGATION_QUERIES,
	NavigationEntry,
	NavigationQueryTypes,
} from '../queries/navigation.queries';

@Injectable()
export class AdminNavigationsService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	public adapt(navigationEntry: Partial<NavigationEntry>): NavigationItem {
		/* istanbul ignore next */
		return {
			id: navigationEntry?.id,
			label: navigationEntry?.label,
			placement: navigationEntry?.placement,
			description: navigationEntry?.description,
			linkTarget: navigationEntry?.link_target,
			iconName: navigationEntry?.icon_name,
			position: navigationEntry?.position,
			contentType: navigationEntry?.content_type,
			contentPath: navigationEntry?.content_path,
			tooltip: navigationEntry?.tooltip,
			updatedAt: navigationEntry?.updated_at,
			createdAt: navigationEntry?.created_at,
			userGroupIds: navigationEntry?.user_group_ids?.map((groupId) => String(groupId)),
		};
	}

	public adaptToDbFormat(navigationItem: Partial<NavigationItem>): NavigationEntry {
		/* istanbul ignore next */
		return {
			id: navigationItem?.id,
			label: navigationItem?.label,
			placement: navigationItem?.placement,
			description: navigationItem?.description,
			link_target: navigationItem?.linkTarget,
			icon_name: navigationItem?.iconName || '', // TODO make nullable in the database
			position: navigationItem?.position,
			content_type: navigationItem?.contentType,
			content_path: navigationItem?.contentPath || '', // TODO make nullable in the database
			tooltip: navigationItem?.tooltip,
			updated_at: navigationItem?.updatedAt,
			created_at: navigationItem?.createdAt,
			user_group_ids: navigationItem?.userGroupIds?.map((groupId) => String(groupId)),
		};
	}

	public async insertElement(navigationItem: CreateNavigationDto): Promise<NavigationItem> {
		const response = await this.dataService.execute<
			NavigationQueryTypes['InsertNavigationItemMutation'],
			NavigationQueryTypes['InsertNavigationItemMutationVariables']
		>(NAVIGATION_QUERIES[getDatabaseType()].InsertNavigationItemDocument, {
			navigationItem: this.adaptToDbFormat(navigationItem),
		});

		return this.adapt(
			(response as NavigationQueryTypes['InsertNavigationItemMutationAvo'])
				.insert_app_content_nav_elements_one ||
				(response as NavigationQueryTypes['InsertNavigationItemMutationHetArchief'])
					.insert_app_navigation_one
		);
	}

	public async updateElement(
		id: string,
		navigationItem: CreateNavigationDto
	): Promise<NavigationItem> {
		const response = await this.dataService.execute<
			NavigationQueryTypes['UpdateNavigationItemByIdMutation'],
			NavigationQueryTypes['UpdateNavigationItemByIdMutationVariables']
		>(NAVIGATION_QUERIES[getDatabaseType()].UpdateNavigationItemByIdDocument, {
			id,
			navigationItem: this.adaptToDbFormat(navigationItem),
		});

		return this.adapt(
			(response as NavigationQueryTypes['InsertNavigationItemMutationAvo'])
				.insert_app_content_nav_elements_one ||
				(response as NavigationQueryTypes['InsertNavigationItemMutationHetArchief'])
					.insert_app_navigation_one
		);
	}

	public async deleteElement(id: string): Promise<DeleteResponse> {
		const response = await this.dataService.execute<
			NavigationQueryTypes['DeleteNavigationItemMutation'],
			NavigationQueryTypes['DeleteNavigationItemMutationVariables']
		>(NAVIGATION_QUERIES[getDatabaseType()].DeleteNavigationItemDocument, {
			id,
		});

		return {
			affectedRows:
				(response as NavigationQueryTypes['DeleteNavigationItemMutationAvo'])
					.delete_app_content_nav_elements?.affected_rows ||
				(response as NavigationQueryTypes['DeleteNavigationItemMutationHetArchief'])
					.delete_app_navigation?.affected_rows ||
				0,
		};
	}

	public async findNavigationBars(): Promise<NavigationItem[]> {
		const navigationsResponse = await this.dataService.execute<
			NavigationQueryTypes['GetNavigationBarsQuery']
		>(NAVIGATION_QUERIES[getDatabaseType()].GetNavigationBarsDocument);

		return (
			(navigationsResponse as NavigationQueryTypes['GetNavigationBarsQueryAvo'])
				.app_content_nav_elements ||
			(navigationsResponse as NavigationQueryTypes['GetNavigationBarsQueryHetArchief'])
				.app_navigation ||
			[]
		).map(this.adapt);
	}

	public async findNavigationBarItemsByPlacementId(placement: string): Promise<NavigationItem[]> {
		const navigationsResponse = await this.dataService.execute<
			NavigationQueryTypes['GetNavigationItemsByPlacementQuery'],
			NavigationQueryTypes['GetNavigationItemsByPlacementQueryVariables']
		>(NAVIGATION_QUERIES[getDatabaseType()].GetNavigationItemsByPlacementDocument, {
			placement,
		});

		return (
			(navigationsResponse as NavigationQueryTypes['GetNavigationItemsByPlacementQueryAvo'])
				.app_content_nav_elements ||
			(
				navigationsResponse as NavigationQueryTypes['GetNavigationItemsByPlacementQueryHetArchief']
			).app_navigation ||
			[]
		).map(this.adapt);
	}

	public async findAllNavigationBarItems(): Promise<NavigationItem[]> {
		const navigationsResponse = await this.dataService.execute<
			NavigationQueryTypes['GetAllNavigationItemsQuery']
		>(NAVIGATION_QUERIES[process.env.DATABASE_APPLICATION_TYPE].GetAllNavigationItemsDocument);

		return (
			(navigationsResponse as NavigationQueryTypes['GetAllNavigationItemsQueryAvo'])
				.app_content_nav_elements ||
			(navigationsResponse as NavigationQueryTypes['GetAllNavigationItemsQueryHetArchief'])
				.app_navigation ||
			[]
		).map(this.adapt);
	}

	public async findElementById(id: string | number): Promise<NavigationItem> {
		const navigationResponse = await this.dataService.execute<
			NavigationQueryTypes['GetNavigationItemByIdQuery'],
			NavigationQueryTypes['GetNavigationItemByIdQueryVariables']
		>(NAVIGATION_QUERIES[getDatabaseType()].GetNavigationItemByIdDocument, {
			id,
		});
		const item =
			(navigationResponse as NavigationQueryTypes['GetNavigationItemByIdQueryAvo'])
				?.app_content_nav_elements?.[0] ||
			(navigationResponse as NavigationQueryTypes['GetNavigationItemByIdQueryHetArchief'])
				?.app_navigation?.[0];

		if (!item) {
			throw new NotFoundException({
				message: 'Item with id was not found',
				additionalInfo: { id },
			});
		}

		return this.adapt(item);
	}
}
