import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';

import { Idp } from '../../shared/auth/auth.types';
import {
	type FindMaintenanceAlertByIdQuery,
	type FindMaintenanceAlertsQuery,
	Lookup_Languages_Enum,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { type CreateMaintenanceAlertDto } from '../dto/maintenance-alerts.dto';
import { type MaintenanceAlert, MaintenanceAlertType } from '../maintenance-alerts.types';

export const mockGqlMaintenanceAlert1: FindMaintenanceAlertsQuery['app_maintenance_alerts'][0] = {
	id: '29f9eac3-0c7e-48ec-9216-3a3af7487766',
	title: 'Gepland onderhoud',
	message:
		'Opgelet! Tussen 25 en 27 februari plannen we een onderhoud aan Het archief. Je zal dus tijdenlijk niet kunnen inloggen Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
	type: MaintenanceAlertType.QUESTION as any,
	from_date: '2022-02-25T16:36:06.045845',
	until_date: '2022-02-27T16:36:06.045845',
	user_groups: [
		'0213c8d4-f459-45ef-8bbc-96268ab56d01',
		'04150e6e-b779-4125-84e5-6ee6fc580757',
		'0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
		'c56d95aa-e918-47ca-b102-486c9449fc4a',
	],
	language: Lookup_Languages_Enum.Nl,
};

export const mockGqlMaintenanceAlert2: FindMaintenanceAlertByIdQuery['app_maintenance_alerts'][0] =
	{
		id: '17741a72-807e-43d0-9869-176593171938',
		title: 'Gepland onderhoud',
		message:
			'Opgelet! Tussen 25 en 27 maart plannen we een onderhoud aan Het archief. Je zal dus tijdenlijk niet kunnen inloggen Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
		type: MaintenanceAlertType.EXCLAMATION as any,
		from_date: '2022-02-25T16:36:06.045845',
		until_date: '2022-02-27T16:36:06.045845',
		user_groups: [
			'0213c8d4-f459-45ef-8bbc-96268ab56d01',
			'04150e6e-b779-4125-84e5-6ee6fc580757',
			'0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
			'c56d95aa-e918-47ca-b102-486c9449fc4a',
		],
		language: Lookup_Languages_Enum.Nl,
	};

export const mockMaintenanceAlert1: MaintenanceAlert = {
	id: '29f9eac3-0c7e-48ec-9216-3a3af7487766',
	title: 'Gepland onderhoud',
	message:
		'Opgelet! Tussen 25 en 27 januari plannen we een onderhoud aan Het archief. Je zal dus tijdenlijk niet kunnen inloggen Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
	type: MaintenanceAlertType.QUESTION,
	fromDate: '2022-02-25T16:36:06.045845',
	untilDate: '2022-02-27T16:36:06.045845',
	userGroups: [
		'0213c8d4-f459-45ef-8bbc-96268ab56d01',
		'04150e6e-b779-4125-84e5-6ee6fc580757',
		'0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
		'c56d95aa-e918-47ca-b102-486c9449fc4a',
	],
	language: Lookup_Languages_Enum.Nl,
};

export const mockMaintenanceAlert2: MaintenanceAlert = {
	id: '17741a72-807e-43d0-9869-176593171938',
	title: 'Gepland onderhoud',
	message:
		'Opgelet! Tussen 25 en 27 maart plannen we een onderhoud aan Het archief. Je zal dus tijdenlijk niet kunnen inloggen Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
	type: MaintenanceAlertType.EXCLAMATION,
	fromDate: '2022-02-25T16:36:06.045845',
	untilDate: '2022-02-27T16:36:06.045845',
	userGroups: [
		'0213c8d4-f459-45ef-8bbc-96268ab56d01',
		'04150e6e-b779-4125-84e5-6ee6fc580757',
		'0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
		'c56d95aa-e918-47ca-b102-486c9449fc4a',
	],
	language: Lookup_Languages_Enum.Nl,
};

export const mockMaintenanceAlert3Faulty: MaintenanceAlert = {
	id: '17741a72-807e-43d0-9869-176593171938',
	title: 'Faulty maintenance alert',
	message:
		'Opgelet! Tussen 25 en 27 maart plannen we een onderhoud aan Het archief. Je zal dus tijdelijk niet kunnen inloggen Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
	type: MaintenanceAlertType.EXCLAMATION,
	fromDate: '2022-02-25T16:36:06.045845',
	untilDate: '2021-02-27T16:36:06.045845',
	userGroups: [
		'0213c8d4-f459-45ef-8bbc-96268ab56d01',
		'04150e6e-b779-4125-84e5-6ee6fc580757',
		'0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
		'c56d95aa-e918-47ca-b102-486c9449fc4a',
	],
	language: Lookup_Languages_Enum.Nl,
};

export const mockNewMaintenanceAlert: CreateMaintenanceAlertDto = {
	title: mockGqlMaintenanceAlert1.title,
	message: mockGqlMaintenanceAlert1.message,
	type: MaintenanceAlertType.QUESTION,
	userGroups: mockGqlMaintenanceAlert1.user_groups,
	fromDate: mockGqlMaintenanceAlert1.from_date,
	untilDate: mockGqlMaintenanceAlert1.until_date,
	language: mockGqlMaintenanceAlert1.language,
};

export const mockMaintenanceAlertsResponse = {
	items: [mockMaintenanceAlert1, mockMaintenanceAlert2, mockMaintenanceAlert3Faulty],
};

export const mockUser: Avo.User.HetArchiefUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: 'c56d95aa-e918-47ca-b102-486c9449fc4a',
	groupName: 'CP_ADMIN',
	permissions: [PermissionName.VIEW_ANY_MAINTENANCE_ALERTS],
	isKeyUser: false,
	visitorSpaceSlug: 'vrt',
	maintainerId: 'OR-rf5kf25',
	createdAt: '2023-03-08T08:00:00',
	lastAccessAt: '2023-03-08T08:00:00',
	organisationId: 'OR-rf5kf25',
	organisationName: 'VRT',
	sector: 'Publieke Omroep',
};
