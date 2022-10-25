import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '../../../../config';

import { GetOrganisationQuery } from '../../shared/generated/graphql-db-types-avo';
import { GetOrganisationQuery as GetOrganisationQueryHetArchief } from '../../shared/generated/graphql-db-types-hetarchief';
import { AvoOrHetArchief } from '../../content-pages/content-pages.types';
import { Organisation } from '../admin-organisations.types';
import { AdminOrganisationsService } from './admin-organisations.service';
import { DataService } from '../../data/services/data.service';

const mockGqlHetArchiefOrganisation: { data: GetOrganisationQueryHetArchief } =
		{
			data: {
				maintainer_content_partner: [
					{
						information: {
							logo: {
								iri: 'https://assets.viaa.be/images/OR-2f7jt01'
							}
						},
						schema_name: 'KAAP',
						schema_identifier: 'OR-2f7jt01'
					}
				]
			}
		};

const mockGqlAvOOrganisation = {
	data: {
		shared_organisations: [
			{
				or_id: 'or-639k481',
				name: 'VRT',
				logo_url: 'http://meemoo.be/some-url'
			}
		]
	}
};

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'DATABASE_APPLICATION_TYPE') {
			return AvoOrHetArchief.hetArchief;
		}
		return key;
	})
};

const mockDataService = {
	execute: jest.fn()
};

describe('OrganisationsService', () => {
	let organisationsService: AdminOrganisationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdminOrganisationsService,
				{
					provide: ConfigService < Configuration >,
					useValue: mockConfigService
				},
				{
					provide: DataService,
					useValue: mockDataService
				}
			]
		}).compile();

		organisationsService = module.get<AdminOrganisationsService>(
				AdminOrganisationsService
		);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(organisationsService).toBeDefined();
	});

	describe('getOrganisations', () => {
		it('should return an organisations from the hetArchief database', async () => {
			mockDataService.execute.mockResolvedValueOnce(
					mockGqlHetArchiefOrganisation
			);
			const organisation: Organisation =
					await organisationsService.getOrganisation('or-639k481');
			expect(organisation.logo_url).toEqual(
					mockGqlHetArchiefOrganisation.data.maintainer_content_partner[0]
							.information.logo.iri
			);
		});

		it('should return an organisations from the AvO database', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlAvOOrganisation);
			const organisation: Organisation =
					await organisationsService.getOrganisation('or-639k481');
			expect(organisation.logo_url).toEqual(
					mockGqlAvOOrganisation.data.shared_organisations[0].logo_url
			);
		});

		it('should return null if the organisations was not found', async () => {
			const mockData: GetOrganisationQuery = {
				shared_organisations: []
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const organisation: Organisation =
					await organisationsService.getOrganisation('or-639k481');
			expect(organisation).toBeNull();
		});
	});
});
