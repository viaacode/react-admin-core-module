import { Test, type TestingModule } from '@nestjs/testing';
import type { Avo } from '@viaa/avo2-types';

import { mockUserAvo } from '../../../mock-user';
import { mockTranslationsService } from '../../shared/helpers/mockTranslationsService';
import { Locale, TranslationsService } from '../../translations';
import { SessionUserEntity } from '../../users/classes/session-user';
import { AssetsService } from '../services/assets.service';

import { AssetsController } from './assets.controller';

const mockAssetsService: Partial<Record<keyof AssetsService, jest.SpyInstance>> = {
	uploadAndTrack: jest.fn(),
	delete: jest.fn(),
};

const mockUploadUrl = 'http//my-s3-bucket.com/my-asset.png';

describe('AssetsController', () => {
	let assetsController: AssetsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AssetsController],
			imports: [],
			providers: [
				{
					provide: AssetsService,
					useValue: mockAssetsService,
				},
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		}).compile();

		assetsController = module.get<AssetsController>(AssetsController);
	});

	it('should be defined', () => {
		expect(assetsController).toBeDefined();
	});

	describe('uploadAsset', () => {
		it('should return the asset url', async () => {
			mockAssetsService.uploadAndTrack.mockResolvedValueOnce(mockUploadUrl);

			const response = await assetsController.uploadAsset(
				{} as any,
				{} as Avo.FileUpload.UploadAssetInfo,
				{ getLanguage: () => Locale.Nl } as any
			);

			expect(response).toEqual({
				url: mockUploadUrl,
			});
		});
	});

	describe('deleteAsset', () => {
		it('should delete asset from s3', async () => {
			await assetsController.deleteAsset(
				{
					url: mockUploadUrl,
				},
				new SessionUserEntity(mockUserAvo)
			);

			expect(mockAssetsService.delete).toHaveBeenCalledTimes(1);
		});
	});
});
