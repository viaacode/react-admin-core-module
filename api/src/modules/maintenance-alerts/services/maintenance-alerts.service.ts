import { IPagination, Pagination } from "@studiohyperdrive/pagination";
import { Logger, NotFoundException } from "@nestjs/common";
import { isArray } from "class-validator";
import { isEmpty, isNil, set } from "lodash";

import { DataService } from "../../data";
import { CreateMaintenanceAlertDto, MaintenanceAlertsQueryDto, UpdateMaintenanceAlertDto } from './../dto/maintenance-alerts.dto';
import { GqlMaintenanceAlert, MaintenanceAlert } from "../maintenance-alerts.types";
import { ORDER_PROP_TO_DB_PROP } from "../maintenance-alerts.conts";

import { SortDirection } from '../../shared/types';
import { PaginationHelper } from "../../shared/helpers/pagination";

export class MaintenanceAlertsService {
	private logger: Logger = new Logger(MaintenanceAlertsService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	public adapt(graphqlMaintenanceAlert: GqlMaintenanceAlert): MaintenanceAlert | null {
		if (!graphqlMaintenanceAlert) {
			return null;
		}

		return {
			id: graphqlMaintenanceAlert.id,
			title: graphqlMaintenanceAlert.title,
			message: graphqlMaintenanceAlert.message,
			icon: graphqlMaintenanceAlert.icon,
			userGroups: graphqlMaintenanceAlert.user_groups,
			fromDate: graphqlMaintenanceAlert.from_date,
			untilDate: graphqlMaintenanceAlert.until_date,
			active: graphqlMaintenanceAlert.active
		}
	}

	public async findAll(
		inputQuery: MaintenanceAlertsQueryDto,
		parameters: {
			userGroupIds: (string | number)[]
		} = null
	): Promise<IPagination<MaintenanceAlert>> {
		const { query, fromDate, untilDate, active, page, size, orderProp, orderDirection } =
			inputQuery;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);

		/** Dynamically build the where object  */
		const where: FindMaintenanceAlertsQueryVariables['where'] = {};

		if (!isEmpty(query) && query !== '%' && query !== '%%') {
			where._or = [
				{ title: { _ilike: query } },
				{ message: { _ilike: query } },
			];
		}

		// Brecht - user group & special user group
		if (!isNil(parameters)) {

			// Brecht - LOGGED IN USER
			if (parameters.userGroupIds[1] === '-2' ) {
				where.user_groups = {
					_in: isArray(parameters.userGroupIds[0]) ? parameters.userGroupIds[0] : [parameters.userGroupIds[0]]
				}
			}

			where.active = {
				_eq: true,
			};

			where._and = [
				{
					from_date: { _gte: new Date().toISOString() }
				},
				{
					until_date: { _lte: new Date().toISOString() }
				}
			];
		} else {
			if (!isEmpty(fromDate)) {
				where.from_date = {
					_gte: fromDate
				}
			}

			if (!isEmpty(untilDate)) {
				where.until_date = {
					_lte: untilDate
				}
			}

			if (!isEmpty(active)) {
				where.active = {
					_eq: active,
				};
			}
		}

		const maintenanceAlertsResponse = await this.dataService.execute<
			FindMaintenanceAlertsQuery,
			FindMaintenanceAlertsQueryVariables
		>(FindMaintenanceAlertsDocument, {
			where,
			offset,
			limit,
			orderBy: set(
				{},
				ORDER_PROP_TO_DB_PROP[orderProp] || ORDER_PROP_TO_DB_PROP['fromDate'],
				orderDirection || SortDirection.desc
			),
		});

		return Pagination<MaintenanceAlert>({
			items: maintenanceAlertsResponse.app_material_requests.map((mr) => this.adapt(mr)),
			page,
			size,
			total: maintenanceAlertsResponse.app_material_requests_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<MaintenanceAlert> {
		const maintenanceAlertResponse = await this.dataService.execute<
			FindMaintenanceAlertsByIdQuery,
			FindMaintenanceAlertsByIdQueryVariables
		>(FindMaintenanceAlertsByIdDocument, { id });

		if (isNil(maintenanceAlertResponse) || !maintenanceAlertResponse.app_maintenance_alerts[0]) {
			throw new NotFoundException(`Material Request with id '${id}' not found`);
		}

		return this.adapt(maintenanceAlertResponse.app_maintenance_alerts[0]);
	}

	public async createMaintenanceAlert(
		createMaintenanceAlertDto: CreateMaintenanceAlertDto
	): Promise<MaintenanceAlert> {
		const newMaintenanceAlert = {
			title: createMaintenanceAlertDto.title,
			message: createMaintenanceAlertDto.message,
			icon: createMaintenanceAlertDto.icon,
			user_groups: createMaintenanceAlertDto.userGroups,
			from_date: createMaintenanceAlertDto.fromDate,
			until_date: createMaintenanceAlertDto.untilDate,
			active: createMaintenanceAlertDto.active
		};

		const { insert_app_maintenance_alerts_one: createdMainteanceAlert } =
			await this.dataService.execute<
				InsertMaintenanceAlertsMutation,
				InsertMaintenanceAlertsMutationVariables
			>(InsertMaintenanceAlertsDocument, {
				newMaintenanceAlert
			});

		this.logger.debug(`Maintenance alert ${createdMainteanceAlert.id} created.`);

		return this.adapt(createdMainteanceAlert);
	}

	public async updateMaintenanceAlert(
		maintenanceAlertId: string,
		updateMaintenanceAlertDto: UpdateMaintenanceAlertDto,
	): Promise<MaintenanceAlert> {
		const { update_app_maintenance_alerts: updatedMaintenanceAlert } =
			await this.dataService.execute<
				UpdateMaintenanceAlertsMutation,
				UpdateMaintenanceAlertsMutationVariables
			>(UpdateMaintenanceAlertsDocument, {
				maintenanceAlertId,
				updateMaintenanceAlertDto,
			});

		this.logger.debug(`Maintenance Alert ${updatedMaintenanceAlert.returning[0].id} updated.`);

		return this.adapt(updatedMaintenanceAlert.returning[0]);
	}

	public async deleteMaintenanceAlert(
		maintenanceAlertId: string
	): Promise<number> {
		const response = await this.dataService.execute<
			DeleteMaintenanceAlertsMutation,
			DeleteMaintenanceAlertsMutationVariables
		>(DeleteMaintenanceAlertsDocument, {
			maintenanceAlertId
		});

		this.logger.debug(`Maintenance alert ${maintenanceAlertId} deleted`);

		return response.delete_app_maintenance_alerts.affected_rows;
	}
}
