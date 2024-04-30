import path from 'path';

import {
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AssetType } from '@viaa/avo2-types';
import AWS, { AWSError, S3 } from 'aws-sdk';
import { mapLimit } from 'blend-promise-utils';
import fse from 'fs-extra';
import got, { ExtendOptions, Got } from 'got';
import _, { escapeRegExp, isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import {
	InsertContentAssetDocument,
	InsertContentAssetMutation,
	InsertContentAssetMutationVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { AssetToken } from '../assets.types';

import { DataService } from 'src/modules/data/services/data.service';

export const UUID_LENGTH = 35;

@Injectable()
export class AssetsService {
	private logger: Logger = new Logger(AssetsService.name, { timestamp: true });
	private token: AssetToken;

	private gotInstance: Got;
	private s3: S3;

	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {
		const gotOptions: ExtendOptions = {
			prefixUrl: process.env.ASSET_SERVER_TOKEN_ENDPOINT,
			resolveBodyOnly: true,
			username: process.env.ASSET_SERVER_TOKEN_USERNAME,
			password: process.env.ASSET_SERVER_TOKEN_PASSWORD,
			responseType: 'json',
			headers: {
				'cache-control': 'no-cache',
				'X-User-Secret-Key-Meta': process.env.ASSET_SERVER_TOKEN_SECRET,
			},
		};
		this.gotInstance = got.extend(gotOptions);
	}

	public setToken(assetToken: AssetToken) {
		this.token = assetToken;
	}

	@Cron('0 4 * * *')
	public async emptyUploadFolder(): Promise<boolean> {
		try {
			await fse.emptyDir(process.env.TEMP_ASSET_FOLDER);
			this.logger.log(`CRON: upload folder '${process.env.TEMP_ASSET_FOLDER}' emptied`);
		} catch (e) {
			this.logger.error({
				message: `CRON error emptying upload folder ${process.env.TEMP_ASSET_FOLDER} `,
				error: new Error(),
			});
			return false;
		}

		return true;
	}

	/**
	 * Returns an s3 client object which contains an up-to-date token to communicate with the s3 server
	 *
	 * A token is requested using this post request:
	 * curl
	 *   -X POST
	 *   -H "X-User-Secret-Key-Meta: myLittleSecret"
	 *   -u hetarchief-s3:*****************
	 *   https://s3-qas.do.viaa.be/_admin/manage/tenants/hetarchief-int/tokens
	 *
	 * Example token:
	 * {
	 * 	"token": "2e2fdbeb1d6df787428964f3574ed4d6",
	 * 	"owner": "hetarchief-s3",
	 * 	"scope": "+hetarchief-int",
	 * 	"expiration": "2019-12-18T19:10:38.947Z",
	 * 	"creation": "2019-12-17T19:10:38.000Z",
	 * 	"secret": "jWX47N9Sa6v2txQDaD7kyjfXa3gA2m2m"
	 * }
	 */
	private async getS3Client(): Promise<S3> {
		try {
			const tokenExpiry = new Date(_.get(this.token, 'expiration')).getTime();
			const now = new Date().getTime();
			const fiveMinutes = 5 * 60 * 1000;
			if (!this.token || tokenExpiry - fiveMinutes < now) {
				// Take 5 minutes margin, to ensure we get a new token well before it expires
				try {
					this.token = await this.gotInstance.post<AssetToken>('', {
						resolveBodyOnly: true, // this is duplicate but fixes a typing error
					});
					console.info('asset service token response: ' + JSON.stringify(this.token));

					this.s3 = new AWS.S3({
						accessKeyId: this.token.token,
						secretAccessKey: this.token.secret,
						endpoint: `${process.env.ASSET_SERVER_ENDPOINT}/${process.env.ASSET_SERVER_BUCKET_NAME}`,
						s3BucketEndpoint: true,
					});
				} catch (err) {
					console.error('asset service token response error: ' + JSON.stringify(err));
					throw new InternalServerErrorException({
						message: 'Failed to get new s3 token for the asset service',
						error: err,
					});
				}
			}

			return this.s3;
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to get s3 client',
				innerException: err,
				token: this.token,
			});
		}
	}

	/**
	 * Checks if the specified file exists on the s3 bucket
	 */
	public metadata(key: string): Promise<S3.Types.HeadObjectOutput | null> {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise<S3.Types.HeadObjectOutput | null>(async (resolve, reject) => {
			try {
				const s3Client: S3 = await this.getS3Client();
				s3Client.headObject(
					{
						Key: key,
						Bucket: process.env.ASSET_SERVER_BUCKET_NAME as string,
					},
					(err: AWSError, metadata: S3.Types.HeadObjectOutput) => {
						if (err && ['NotFound', 'Forbidden'].includes(err.code)) {
							return resolve(null);
						} else if (err) {
							const error = new InternalServerErrorException({
								message: 'Failed to get metadata of object on the asset service',
								innerException: err,
								additionalInfo: { s3Key: key },
							});
							console.error(error);
							reject(error);
						} else {
							resolve(metadata);
						}
					}
				);
			} catch (err) {
				const error = new InternalServerErrorException({
					message: 'Failed to get metadata of object on the asset service',
					innerException: err,
					additionalInfo: {
						key,
					},
				});
				console.error(error);
				reject(error);
			}
		});
	}

	public async uploadAndTrack(
		assetFiletype: AssetType,
		file: any,
		ownerId: string,
		preferredKey?: string
	): Promise<string> {
		const url = await this.upload(assetFiletype, file, preferredKey);
		await this.addAssetEntryToDb(ownerId, assetFiletype, url);
		return url;
	}

	private async upload(
		assetFiletype: AssetType,
		file: any,
		preferredKey?: string
	): Promise<string> {
		const parsedFilename = path.parse(file.originalname);
		const key = `${assetFiletype}/${
			preferredKey ?? `${_.kebabCase(parsedFilename.name)}-${uuidv4()}${parsedFilename.ext}`
		}`;

		return this.uploadToObjectStore(key, file);
	}

	public async uploadToObjectStore(key: string, file: any): Promise<string> {
		const s3Client = await this.getS3Client();

		let fileBody: Buffer;
		if (file.buffer) {
			fileBody = file.buffer;
		} else {
			fileBody = await fse.readFile(file.path);
		}

		// eslint-disable-next-line no-async-promise-executor
		return new Promise<string>(async (resolve, reject) => {
			try {
				s3Client.putObject(
					{
						Key: key,
						Body: fileBody,
						ACL: 'public-read',
						ContentType: file.mimetype,
						Bucket: process.env.ASSET_SERVER_BUCKET_NAME,
					},
					(err: AWSError) => {
						if (err) {
							const error = new InternalServerErrorException({
								message: 'Failed to upload asset to the s3 asset service',
								error: err,
							});
							this.logger.error(error);
							reject(error);
						} else {
							const url = new URL(process.env.ASSET_SERVER_ENDPOINT);
							url.pathname = `${process.env.ASSET_SERVER_BUCKET_NAME}/${key}`;
							resolve(url.href);
						}
					}
				);
			} catch (err) {
				const error = new InternalServerErrorException({
					message: 'Failed to upload asset to the s3 asset service',
					error: err,
				});
				this.logger.error(error);
				reject(error);
			}
			if (!file.buffer) {
				fse.unlink(file.path)?.catch((err) =>
					this.logger.error({
						message: 'Failed to remove file from tmp folder after upload to s3',
						innerException: err,
					})
				);
			}
		});
	}

	/**
	 * Converts a s3 key to the url to the file
	 * eg:
	 * https://assets-qas.hetarchief.be/avo2/CONTENT_BLOCK_IMAGE/uitgeklaard-alcohol-674cb610-c738-11ed-98c3-817ccda88eec.jpg
	 * to
	 * CONTENT_BLOCK_IMAGE/uitgeklaard-alcohol-674cb610-c738-11ed-98c3-817ccda88eec.jpg
	 * @param url
	 */
	public getKeyFromUrl(url: string): string | null {
		return url.split(`/${process.env.ASSET_SERVER_BUCKET_NAME as string}/`).pop() || null;
	}

	/**
	 * Converts an url to a file to the s3 key
	 * eg:
	 * CONTENT_BLOCK_IMAGE/uitgeklaard-alcohol-674cb610-c738-11ed-98c3-817ccda88eec.jpg
	 * to
	 * https://assets-qas.hetarchief.be/avo2/CONTENT_BLOCK_IMAGE/uitgeklaard-alcohol-674cb610-c738-11ed-98c3-817ccda88eec.jpg
	 * @param key
	 */
	public getUrlFromKey(key: string): string {
		return `${process.env.ASSET_SERVER_ENDPOINT as string}/${
			process.env.ASSET_SERVER_BUCKET_NAME as string
		}/${key}`;
	}

	public async delete(url: string) {
		const s3Client: S3 = await this.getS3Client();
		return new Promise<boolean>((resolve, reject) => {
			try {
				s3Client.deleteObject(
					{
						Key: url.split(`/${process.env.ASSET_SERVER_BUCKET_NAME}/`).pop(),
						Bucket: process.env.ASSET_SERVER_BUCKET_NAME,
					},
					(err: AWSError) => {
						if (err) {
							const error = new InternalServerErrorException({
								message: 'Failed to delete asset from S3',
								error: err,
								url,
							});
							this.logger.error(error);
							reject(error);
						} else {
							resolve(true);
						}
					}
				);
			} catch (err) {
				const error = new InternalServerErrorException({
					message: 'Failed to delete asset from S3',
					error: err,
				});
				this.logger.error(error);
				reject(error);
			}
		});
	}

	public async copyAndTrack(
		assetFiletype: AssetType,
		url: string,
		ownerId: string,
		copyKey?: string
	): Promise<string> {
		const copiedUrl = await this.copy(url, copyKey);
		await this.addAssetEntryToDb(ownerId, assetFiletype, copiedUrl);
		return copiedUrl;
	}

	/**
	 * Makes a copy of a file on the s3 server
	 * @param url url of the file you want to make a copy of. This can be an url on a different asset server than the one from the current environment
	 * @param copyKey the name of the copied file, if not passed, an uuid will be appended to the original file name
	 */
	private copy(url: string, copyKey?: string | undefined): Promise<string> {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise<string>(async (resolve, reject) => {
			const bucket = process.env.ASSET_SERVER_BUCKET_NAME as string;
			let newKey: string | null = null;
			let key: string | null = null;
			try {
				const s3Client: S3 = await this.getS3Client();
				key = this.getKeyFromUrl(url);
				if (!key) {
					throw new InternalServerErrorException({
						message:
							'Failed to copy file at url, because we failed to extract the file path from the url after the bucket location',
						innerException: null,
						additionalInfo: { bucketName: bucket, url },
					});
				}
				const newId = uuidv4();
				const parts = path.parse(key);
				newKey =
					copyKey ||
					parts.dir +
						'/' +
						parts.name.substring(0, parts.name.length - UUID_LENGTH) +
						newId +
						parts.ext;

				if (url.includes(process.env.ASSET_SERVER_ENDPOINT)) {
					// Asset is located on the same asset server as the current environment (eg: copy content block from QAS content page to content page on QAS)
					// Use the s3 copy object since it is more efficient
					s3Client.copyObject(
						{
							Key: newKey,
							Bucket: bucket,
							CopySource: `${bucket}/${key}`,
						},
						(err: AWSError) => {
							if (err) {
								const error = new InternalServerErrorException({
									message: 'Failed to copy asset from the s3 asset service',
									innerException: err,
									additionalInfo: {
										url,
										newKey,
										bucket,
										copySource: `${bucket}/${key}`,
									},
								});
								console.error(error);
								reject(error);
							} else {
								resolve(this.getUrlFromKey(newKey as string));
							}
						}
					);
				} else {
					// Asset is located on a different asset server than the current environment (eg: copy content block from PRD content page to content page on QAS)
					// Download the asset and upload it again to the asset service of this environment
					const response = await got.get(url).buffer();
					s3Client.putObject({ Key: newKey, Bucket: bucket, Body: response }, (err) => {
						if (err) {
							const error = new InternalServerErrorException({
								message: 'Failed to upload asset to the s3 asset service',
								innerException: err,
								additionalInfo: {
									url,
									newKey,
									bucket,
								},
							});
							console.error(error);
							reject(error);
						} else {
							resolve(this.getUrlFromKey(newKey as string));
						}
					});
				}
			} catch (err) {
				const error = {
					message: 'Failed to copy file on s3',
					innerException: err,
					additionalInfo: {
						url,
						key: newKey,
						bucket,
						copySource: `${bucket}/${key}`,
					},
				};
				console.error(JSON.stringify(error));
				reject(new InternalServerErrorException(error));
			}
		});
	}

	public async duplicateAssetsInJsonBlob(
		jsonBlob: any,
		ownerId: string,
		assetType: AssetType
	): Promise<any> {
		let jsonBlobString = JSON.stringify(jsonBlob);
		const assetUrlsRegex = new RegExp(
			`(${process.env.ASSET_SERVER_ENDPOINTS_ALL_ENVS.split(',')
				.map(escapeRegExp)
				.join('|')})/${escapeRegExp(process.env.ASSET_SERVER_BUCKET_NAME)}/[^"\\\\]+`,
			'g'
		);
		const urls = jsonBlobString.match(assetUrlsRegex);
		console.info('Find asset urls in json: ', {
			jsonBlobString,
			assetUrlsRegex,
			foundUrls: urls,
		});

		let newUrls: string[] = [];
		const failedUrls: string[] = [];
		if (urls && !isNil(ownerId)) {
			newUrls = await mapLimit(urls, 5, async (url: string) => {
				try {
					return await this.copyAndTrack(assetType, url, ownerId);
				} catch (err) {
					failedUrls.push(url);
					console.error(
						JSON.stringify({
							message: 'Failed to copy and track asset url',
							innerException: err,
							additionalInfo: {
								url,
							},
						})
					);
					return null;
				}
			});

			newUrls.forEach((newUrl: string, index: number) => {
				jsonBlobString = jsonBlobString?.replace(urls[index], newUrl) || null;
			});
		}

		if (failedUrls.length > 0) {
			console.error({
				message: 'Failed to copy and track asset urls',
				innerException: null,
				additionalInfo: {
					failedUrls,
				},
			});
		}

		return JSON.parse(jsonBlobString);
	}

	public async addAssetEntryToDb(ownerId: string, type: AssetType, url: string): Promise<void> {
		const asset = {
			owner_id: ownerId,
			content_asset_type_id: type,
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
	}
}
