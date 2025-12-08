import { Test, type TestingModule } from '@nestjs/testing';

import { DataService } from '../../data';
import { type GetOrganisationsQuery as GetOrganisationQueryAvo } from '../../shared/generated/graphql-db-types-avo';
import { type GetOrganisationsQuery as GetOrganisationQueryHetArchief } from '../../shared/generated/graphql-db-types-hetarchief';
import { type Organisation } from '../admin-organisations.types';

import { AdminOrganisationsService } from './admin-organisations.service';

const mockGqlHetArchiefOrganisation: { data: GetOrganisationQueryHetArchief } = {
	data: {
		graph_organization: [
			{
				ha_org_has_logo: 'https://assets.viaa.be/images/OR-2f7jt01',
				skos_pref_label: 'KAAP',
				org_identifier: 'OR-2f7jt01',
				id: 'https://data.viaa.be/graph/organizations/OR-2f7jt01',
			},
		],
	},
};

const mockGqlAvOOrganisation = {
	data: {
		shared_organisations: [
			{
				or_id: 'or-639k481',
				name: 'VRT',
				logo_url: 'https://meemoo.be/some-url',
			},
		],
	},
};

const mockDataService = {
	execute: jest.fn(),
};

describe('OrganisationsService', () => {
	let organisationsService: AdminOrganisationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdminOrganisationsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		organisationsService = module.get<AdminOrganisationsService>(AdminOrganisationsService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(organisationsService).toBeDefined();
	});

	describe('getOrganisations', () => {
		it('should return an organisations from the hetArchief database', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlHetArchiefOrganisation);
			const organisation: Organisation = await organisationsService.getOrganisation('or-639k481');
			expect(organisation.logo_url).toEqual(
				mockGqlHetArchiefOrganisation.data.graph_organization[0].ha_org_has_logo
			);
		});

		it('should return an organisations from the AvO database', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlAvOOrganisation);
			const organisation: Organisation = await organisationsService.getOrganisation('or-639k481');
			expect(organisation.logo_url).toEqual(
				mockGqlAvOOrganisation.data.shared_organisations[0].logo_url
			);
		});

		it('should return null if the organisations was not found', async () => {
			const mockData: GetOrganisationQueryAvo = {
				shared_organisations: [],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const organisation: Organisation = await organisationsService.getOrganisation('or-639k481');
			expect(organisation).toBeNull();
		});
	});
});
