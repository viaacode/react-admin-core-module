import { Group, GroupIdToName, HetArchiefUser } from '../../users';
import { Idp } from '../../shared/auth/auth.types';
import { PermissionName } from '@viaa/avo2-types';

import { MaintenanceAlert, MaintenanceAlertType } from "../maintenance-alerts.types";
import { FindMaintenanceAlertByIdQuery, FindMaintenanceAlertsQuery } from '../../../modules/shared/generated/graphql-db-types-hetarchief';

export const mockGqlMaintenanceAlert1: FindMaintenanceAlertsQuery['app_maintenance_alerts'][0] = {
	id: "29f9eac3-0c7e-48ec-9216-3a3af7487766",
	title: "Gepland onderhoud",
	message: "Opgelet! Tussen 25 en 27 februari plannen we een onderhoud aan Het archief. Je zal dus tijdenlijk niet kunnen inloggen Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
	type: MaintenanceAlertType.QUESTION as any,
	from_date: "2022-02-25T16:36:06.045845",
	until_date: "2022-02-27T16:36:06.045845",
	user_groups: [
		"0213c8d4-f459-45ef-8bbc-96268ab56d01",
		"04150e6e-b779-4125-84e5-6ee6fc580757",
		"0b281484-76cd-45a9-b6ce-68a0ea7f4b26",
		"c56d95aa-e918-47ca-b102-486c9449fc4a"
	]
}

export const mockGqlMaintenanceAlert2: FindMaintenanceAlertByIdQuery['app_maintenance_alerts'][0] = {
	id: "17741a72-807e-43d0-9869-176593171938",
  title: "Gepland onderhoud",
	message: "Opgelet! Tussen 25 en 27 maart plannen we een onderhoud aan Het archief. Je zal dus tijdenlijk niet kunnen inloggen Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
	type: MaintenanceAlertType.EXCLAMATION as any,
	from_date: "2022-02-25T16:36:06.045845",
	until_date: "2022-02-27T16:36:06.045845",
	user_groups: [
		"0213c8d4-f459-45ef-8bbc-96268ab56d01",
		"04150e6e-b779-4125-84e5-6ee6fc580757",
		"0b281484-76cd-45a9-b6ce-68a0ea7f4b26",
		"c56d95aa-e918-47ca-b102-486c9449fc4a",
	]
}

export const mockMaintenanceAlert1: MaintenanceAlert = {
	id: "29f9eac3-0c7e-48ec-9216-3a3af7487766",
	title: "Gepland onderhoud",
	message: "Opgelet! Tussen 25 en 27 januari plannen we een onderhoud aan Het archief. Je zal dus tijdenlijk niet kunnen inloggen Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
	type: MaintenanceAlertType.QUESTION,
	fromDate: "2022-02-25T16:36:06.045845",
	untilDate: "2022-02-27T16:36:06.045845",
	userGroups: [
		"0213c8d4-f459-45ef-8bbc-96268ab56d01",
		"04150e6e-b779-4125-84e5-6ee6fc580757",
		"0b281484-76cd-45a9-b6ce-68a0ea7f4b26",
		"c56d95aa-e918-47ca-b102-486c9449fc4a",
	]
};
const mockMaintenanceAlert2: MaintenanceAlert = {
	id: "17741a72-807e-43d0-9869-176593171938",
  title: "Gepland onderhoud",
	message: "Opgelet! Tussen 25 en 27 maart plannen we een onderhoud aan Het archief. Je zal dus tijdenlijk niet kunnen inloggen Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
	type: MaintenanceAlertType.EXCLAMATION,
	fromDate: "2022-02-25T16:36:06.045845",
	untilDate: "2022-02-27T16:36:06.045845",
	userGroups: [
		"0213c8d4-f459-45ef-8bbc-96268ab56d01",
		"04150e6e-b779-4125-84e5-6ee6fc580757",
		"0b281484-76cd-45a9-b6ce-68a0ea7f4b26",
		"c56d95aa-e918-47ca-b102-486c9449fc4a",
	]
};

export const mockMaintenanceAlertsResponse = {
	items: [mockMaintenanceAlert1, mockMaintenanceAlert2],
};

export const mockUser: HetArchiefUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [PermissionName.VIEW_ANY_MAINTENANCE_ALERTS],
};
