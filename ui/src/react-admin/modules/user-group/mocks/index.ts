import { PermissionName } from '@viaa/avo2-types';

import { UserGroupWithPermissions } from '../types/user-group.types';

export const permissionDataMock = {
	data: {
		users_permission: [
			{
				id: '8fec2789-f005-4e7c-ac31-6edcae654924',
				name: '1',
				label: 'CAN_APPROVE_DENY_ALL_VISIT_REQUESTS',
				description: 'description',
			},
			{
				id: '0a5dc284-012e-4d21-ae75-6dc9757df67b',
				name: '2',
				label: 'CAN_READ_ALL_VISIT_REQUESTS',
				description: 'description',
			},
			{
				id: 'd24ae04b-2c08-4e3f-ab13-30e0dedc49b3',
				name: '3',
				label: 'CAN_APPROVE_DENY_CP_VISIT_REQUESTS',
				description: 'description',
			},
			{
				id: 'b4524ee0-3426-428b-a230-ce7763c41f3b',
				name: '4',
				label: 'CAN_READ_CP_VISIT_REQUESTS',
				description: 'description',
			},
			{
				id: '3b2afc9a-f453-47a0-94fb-c1f1e33435a3',
				name: '5',
				label: 'CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS',
				description: 'description',
			},
			{
				id: '3b2afc9a-f453-47a0-94fb-c1f1e33435a3',
				name: '6',
				label: 'CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS',
				description: 'description',
			},
			{
				id: '3b2afc9a-f453-47a0-94fb-c1f1e33435a3',
				name: '7',
				label: 'CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS',
				description: 'description',
			},
			{
				id: '3b2afc9a-f453-47a0-94fb-c1f1e33435a3',
				name: '8',
				label: 'CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS',
				description: 'description',
			},
			{
				id: '3b2afc9a-f453-47a0-94fb-c1f1e33435a3',
				name: '9',
				label: 'CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS',
				description: 'description',
			},
			{
				id: '3b2afc9a-f453-47a0-94fb-c1f1e33435a3',
				name: '10',
				labele: 'CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS',
				description: 'description',
			},
			{
				id: '3b2afc9a-f453-47a0-94fb-c1f1e33435a3',
				label: '11',
				name: 'CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS',
				description: 'description',
			},
		],
	},
};

export const userGroupDataMock: UserGroupWithPermissions[] = [
	{
		name: 'CP_ADMIN',
		label: 'cp admin',
		id: 'c56d95aa-e918-47ca-b102-486c9449fc4a',
		permissions: [
			{
				id: '5719b86d-a3ff-49fc-ab02-58b2a983dc91',
				name: PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
				description: 'description',
				label: 'zoeken',
			},
			{
				id: '5719b86d-a3ff-49fc-ab02-58b2a983dc91',
				name: PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
				description: 'description',
				label: 'zoeken',
			},
			{
				id: '5719b86d-a3ff-49fc-ab02-58b2a983dc91',
				name: PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
				description: 'description',
				label: 'zoeken',
			},
		],
	},
	{
		name: 'VISITOR',
		label: 'gebruiker',
		id: '0213c8d4-f459-45ef-8bbc-96268ab56d01',
		permissions: [
			{
				id: '5719b86d-a3ff-49fc-ab02-58b2a983dc91',
				name: PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
				description: 'description',
				label: 'zoeken',
			},
		],
	},
	{
		name: 'KIOSK_VISITOR',
		label: 'kiosk gebruiker',
		id: '04150e6e-b779-4125-84e5-6ee6fc580757',
		permissions: [],
	},
	{
		name: 'MEEMOO_ADMIN',
		label: 'Site beheerder',
		id: '0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
		permissions: [
			{
				id: '5719b86d-a3ff-49fc-ab02-58b2a983dc91',
				name: PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
				description: 'description',
				label: 'zoeken',
			},
			{
				id: '5719b86d-a3ff-49fc-ab02-58b2a983dc91',
				name: PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
				description: 'description',
				label: 'zoeken',
			},
			{
				id: '5719b86d-a3ff-49fc-ab02-58b2a983dc91',
				name: PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
				description: 'description',
				label: 'zoeken',
			},
			{
				id: '5719b86d-a3ff-49fc-ab02-58b2a983dc91',
				name: PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
				description: 'description',
				label: 'zoeken',
			},
			{
				id: '5719b86d-a3ff-49fc-ab02-58b2a983dc91',
				name: PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
				description: 'description',
				label: 'zoeken',
			},
		],
	},
];
