import { randomUUID } from 'crypto'

import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import got, { Got, Options } from 'got'
import { ASTNode } from 'graphql/language/ast'
import { print } from 'graphql/language/printer'
import { isString } from 'lodash'

import { DuplicateKeyException } from '../../shared/exceptions/duplicate-key.exception'
import { customError } from '../../shared/helpers/custom-error'
import { GraphQlResponse } from '../types'

@Injectable()
export class DataService {
	private logger: Logger = new Logger(DataService.name, { timestamp: true })
	private gotInstance: Got

	constructor() {
		const dbConfig: Options = {
			prefixUrl: process.env.GRAPHQL_URL,
			headers: {
				'x-hasura-admin-secret': process.env.GRAPHQL_SECRET,
			},
			resolveBodyOnly: true,
			responseType: 'json',
			https: {
				// TODO remove once error in certificates has been fixed: https://meemoo.atlassian.net/browse/OPS-1835
				rejectUnauthorized: false,
			},
		}
		this.gotInstance = got.extend(dbConfig)
	}

	/**
	 * execute a (GraphQl) query
	 */
	public async execute<QueryType, QueryVariablesType = void>(
		query: string | TypedDocumentNode<any, any>,
		variables?: QueryVariablesType
	): Promise<QueryType> {
		try {
			const queryData = {
				query: typeof query === 'string' ? query : print(query as ASTNode),
				variables,
			}

			const id = randomUUID()
			if (process.env.GRAPHQL_LOG_QUERIES === 'true') {
				this.logger.log(
					`[ADMIN_CORE] ${id}, Executing graphql query: ${
						queryData.query
					}  ---  ${JSON.stringify(queryData.variables)}`
				)
			}
			const data = await this.gotInstance.post<GraphQlResponse>({
				json: queryData,
				resolveBodyOnly: true, // this is duplicate but fixes a typing error
			})
			if (process.env.GRAPHQL_LOG_QUERIES === 'true') {
				this.logger.log(
					`[ADMIN_CORE] ${id}, Response from graphql query: ${JSON.stringify(data)}`
				)
			}
			if (data.errors) {
				this.logger.error(
					customError(`GraphQl query failed`, null, {
						query: isString(query)
							? query
							: ((query as TypedDocumentNode<any, any>)?.definitions?.[0] as any)
									?.name?.value,
						variables,
						graphqlErrors: data.errors,
					})
				)
				if (data.errors[0]?.extensions?.code === 'constraint-violation') {
					throw new DuplicateKeyException({
						message: data.errors[0].message,
						path: data.errors[0].extensions.path,
					})
				}
				throw new InternalServerErrorException(data)
			}
			return data.data
		} catch (err: any) {
			if (err instanceof DuplicateKeyException) {
				throw err
			}

			this.logger.error(
				customError('Failed to get data from database', err, {
					requestUrl: err?.request?.requestUrl,
					query: isString(query)
						? query
						: ((query as TypedDocumentNode<any, any>)?.definitions?.[0] as any)?.name
								?.value,
					variables,
				})
			)

			throw new InternalServerErrorException(
				null,
				'Failed to get data from database, check the logs for more information.'
			)
		}
	}
}
