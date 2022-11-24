import { randomUUID } from 'crypto';

import {
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';

import got, { Got, Options } from 'got';
import { print } from 'graphql/language/printer';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { GraphQlResponse, QueryOrigin } from '../types';

import { DataPermissionsService } from './data-permissions.service';

import { HetArchiefUser } from '../../users/types';
import { DuplicateKeyException } from '../../shared/exceptions/duplicate-key.exception';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { ASTNode } from 'graphql/language/ast';

@Injectable()
export class DataService {
	private logger: Logger = new Logger(DataService.name, { timestamp: true });
	private gotInstance: Got;

	constructor(
		@Inject(forwardRef(() => DataPermissionsService))
		private dataPermissionsService: DataPermissionsService,
	) {
		const dbConfig: Options = {
			prefixUrl: process.env.GRAPHQL_URL,
			headers: {
				'x-hasura-admin-secret': process.env.GRAPHQL_SECRET,
			},
			resolveBodyOnly: true,
			responseType: 'json',
		};
		this.gotInstance = got.extend(dbConfig);
	}

	/**
	 * Execute an incoming query from the client
	 * @param user
	 * @param queryDto the query to be executed
	 * @returns the query result
	 */
	public async executeClientQuery(
		user: HetArchiefUser,
		queryDto: GraphQlQueryDto,
	): Promise<GraphQlResponse> {
		// check if query can be executed
		if (
			!(await this.dataPermissionsService.isAllowedToExecuteQuery(
				user,
				queryDto,
				QueryOrigin.ADMIN_CORE,
			))
		) {
			const queryName = this.dataPermissionsService.getQueryName(
				queryDto.query,
			);
			throw new ForbiddenException(
				'You are not authorized to execute this query: ' + queryName,
			);
		}
		return this.execute(
			this.dataPermissionsService.getWhitelistedQuery(
				queryDto.query,
				QueryOrigin.ADMIN_CORE,
			),
			queryDto.variables,
		);
	}

	/**
	 * execute a (GraphQl) query
	 */
	public async execute<QueryType, QueryVariablesType = void>(
		query: string | TypedDocumentNode,
		variables?: QueryVariablesType,
	): Promise<QueryType> {
		try {
			const queryData = {
				query: typeof query === 'string' ? query : print(query as ASTNode),
				variables,
			};

			const id = randomUUID();
			if (process.env.GRAPHQL_LOG_QUERIES === 'true') {
				this.logger.log(
					`[ADMIN_CORE] ${id}, Executing graphql query: ${
						queryData.query
					}  ---  ${JSON.stringify(queryData.variables)}`,
				);
			}
			const data = await this.gotInstance.post<GraphQlResponse>({
				json: queryData,
				resolveBodyOnly: true, // this is duplicate but fixes a typing error
			});
			if (process.env.GRAPHQL_LOG_QUERIES === 'true') {
				this.logger.log(
					`[ADMIN_CORE] ${id}, Response from graphql query: ${JSON.stringify(
						data,
					)}`,
				);
			}
			if (data.errors) {
				this.logger.error(
					`GraphQl query failed: ${JSON.stringify(data.errors)}`,
				);
				if (data.errors[0]?.extensions?.code === 'constraint-violation') {
					throw new DuplicateKeyException({
						message: data.errors[0].message,
						path: data.errors[0].extensions.path,
					});
				}
				throw new InternalServerErrorException(data);
			}
			return data.data;
		} catch (err) {
			if (err instanceof DuplicateKeyException) {
				throw err;
			}

			this.logger.error('Failed to get data from database', err);

			throw new InternalServerErrorException(
				null,
				'Failed to get data from database, check the logs for more information.',
			);
		}
	}
}