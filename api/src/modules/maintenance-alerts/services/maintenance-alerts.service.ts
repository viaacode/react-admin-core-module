import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { isEmpty, isNil, set } from 'lodash';

import { DataService } from '../../data';
import {
	DeleteMaintenanceAlertDocument,
	DeleteMaintenanceAlertMutation,
	DeleteMaintenanceAlertMutationVariables,
	FindMaintenanceAlertByIdDocument,
	FindMaintenanceAlertByIdQuery,
	FindMaintenanceAlertByIdQueryVariables,
	FindMaintenanceAlertsDocument,
	FindMaintenanceAlertsQuery,
	FindMaintenanceAlertsQueryVariables,
	InsertMaintenanceAlertDocument,
	InsertMaintenanceAlertMutation,
	InsertMaintenanceAlertMutationVariables,
	UpdateMaintenanceAlertDocument,
	UpdateMaintenanceAlertMutation,
	UpdateMaintenanceAlertMutationVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { PaginationHelper } from '../../shared/helpers/pagination';
import { SortDirection } from '../../shared/types';
import { Locale } from '../../translations';
import {
	CreateMaintenanceAlertDto,
	MaintenanceAlertsQueryDto,
	UpdateMaintenanceAlertDto,
} from '../dto/maintenance-alerts.dto';
import { ORDER_PROP_TO_DB_PROP } from '../maintenance-alerts.conts';
import { GqlMaintenanceAlert, MaintenanceAlert } from '../maintenance-alerts.types';

@Injectable()
export class MaintenanceAlertsService {
	private logger: Logger = new Logger(MaintenanceAlertsService.name, { timestamp: true });

	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	public adapt(graphqlMaintenanceAlert: GqlMaintenanceAlert): MaintenanceAlert | null {
		if (!graphqlMaintenanceAlert) {
			return null;
		}

		return {
			id: graphqlMaintenanceAlert.id,
			title: graphqlMaintenanceAlert.title,
			message: graphqlMaintenanceAlert.message,
			type: graphqlMaintenanceAlert.type,
			fromDate: graphqlMaintenanceAlert.from_date,
			untilDate: graphqlMaintenanceAlert.until_date,
			userGroups: graphqlMaintenanceAlert.user_groups,
			language: graphqlMaintenanceAlert.language,
		};
	}

	public async findAll(
		inputQuery: MaintenanceAlertsQueryDto,
		onlyActive: boolean
	): Promise<IPagination<MaintenanceAlert>> {
		const { page, size, orderProp, orderDirection, languages, searchTerm } = inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		const whereAndFilter = [];
		if (onlyActive) {
			whereAndFilter.push(
				{
					from_date: { _lte: new Date().toISOString() },
				},
				{
					until_date: { _gte: new Date().toISOString() },
				}
			);
		}
		if (languages?.length) {
			whereAndFilter.push({ language: { _in: languages.split(',') as Locale[] } });
		}
		if (searchTerm) {
			whereAndFilter.push({
				_or: [
					{ title: { _ilike: `%${searchTerm}%` } },
					{ message: { _ilike: `%${searchTerm}%` } },
				],
			});
		}
		const where: FindMaintenanceAlertsQueryVariables['where'] = whereAndFilter.length
			? {
					_and: whereAndFilter,
				}
			: {};

		const maintenanceAlertsResponse = await this.dataService.execute<
			FindMaintenanceAlertsQuery,
			FindMaintenanceAlertsQueryVariables
		>(FindMaintenanceAlertsDocument, {
			where,
			offset,
			limit: Number(limit),
			orderBy: set(
				{},
				ORDER_PROP_TO_DB_PROP[orderProp] || ORDER_PROP_TO_DB_PROP['fromDate'],
				orderDirection || SortDirection.desc
			),
		});

		return Pagination<MaintenanceAlert>({
			items: maintenanceAlertsResponse.app_maintenance_alerts.map(this.adapt),
			page,
			size,
			total: maintenanceAlertsResponse.app_maintenance_alerts_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<MaintenanceAlert> {
		const maintenanceAlertResponse = await this.dataService.execute<
			FindMaintenanceAlertByIdQuery,
			FindMaintenanceAlertByIdQueryVariables
		>(FindMaintenanceAlertByIdDocument, { id });

		if (
			isNil(maintenanceAlertResponse) ||
			!maintenanceAlertResponse.app_maintenance_alerts[0]
		) {
			throw new NotFoundException(`Maintenance Alert with id '${id}' not found`);
		}

		return this.adapt(maintenanceAlertResponse.app_maintenance_alerts[0]);
	}

	public async createMaintenanceAlert(
		createMaintenanceAlertDto: CreateMaintenanceAlertDto
	): Promise<MaintenanceAlert> {
		const newMaintenanceAlert = {
			title: createMaintenanceAlertDto.title,
			message: createMaintenanceAlertDto.message,
			type: createMaintenanceAlertDto.type,
			user_groups: createMaintenanceAlertDto.userGroups,
			from_date: createMaintenanceAlertDto.fromDate,
			until_date: createMaintenanceAlertDto.untilDate,
			language: createMaintenanceAlertDto.language,
		};

		const { insert_app_maintenance_alerts_one: createdMaintenanceAlert } =
			await this.dataService.execute<
				InsertMaintenanceAlertMutation,
				InsertMaintenanceAlertMutationVariables
			>(InsertMaintenanceAlertDocument, {
				newMaintenanceAlert,
			});

		return this.adapt(createdMaintenanceAlert);
	}

	public async updateMaintenanceAlert(
		maintenanceAlertId: string,
		updateMaintenanceAlertDto: UpdateMaintenanceAlertDto
	): Promise<MaintenanceAlert> {
		const { title, message, type, userGroups, fromDate, untilDate, language } =
			updateMaintenanceAlertDto;

		const updateMaintenanceAlert = {
			title,
			message,
			type,
			user_groups: userGroups,
			from_date: fromDate,
			until_date: untilDate,
			language: language,
		};

		const { update_app_maintenance_alerts: updatedMaintenanceAlert } =
			await this.dataService.execute<
				UpdateMaintenanceAlertMutation,
				UpdateMaintenanceAlertMutationVariables
			>(UpdateMaintenanceAlertDocument, {
				maintenanceAlertId,
				updateMaintenanceAlert,
			});

		if (isEmpty(updatedMaintenanceAlert.returning[0])) {
			throw new BadRequestException(
				`Maintenance alert (${maintenanceAlertId}) could not be updated.`
			);
		}

		this.logger.debug(`Maintenance Alert ${updatedMaintenanceAlert.returning[0]?.id} updated.`);

		return this.adapt(updatedMaintenanceAlert.returning[0]);
	}

	public async deleteMaintenanceAlert(maintenanceAlertId: string): Promise<number> {
		const response = await this.dataService.execute<
			DeleteMaintenanceAlertMutation,
			DeleteMaintenanceAlertMutationVariables
		>(DeleteMaintenanceAlertDocument, {
			maintenanceAlertId,
		});

		return response.delete_app_maintenance_alerts.affected_rows;
	}
}
