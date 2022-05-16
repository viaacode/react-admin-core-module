import { Permission} from "~modules/user/user.types";
import { UserGroup } from "../user-group.types";

export const permissionDataMock = {
	data: {
		users_permission: [
			{
				id: "8fec2789-f005-4e7c-ac31-6edcae654924",
				label: "Gebruiker: Alle aanvragen verwerken",
				name: "CAN_APPROVE_DENY_ALL_VISIT_REQUESTS"
			},
			{
				id: "0a5dc284-012e-4d21-ae75-6dc9757df67b",
				label: "Gebruiker: Alle aanvragen bekijken",
				name: "CAN_READ_ALL_VISIT_REQUESTS"
			},
			{
				id: "d24ae04b-2c08-4e3f-ab13-30e0dedc49b3",
				label: "Contentpartner: Aanvragen eigen bezoekersruimte verwerken",
				name: "CAN_APPROVE_DENY_CP_VISIT_REQUESTS"
			},
			{
				id: "b4524ee0-3426-428b-a230-ce7763c41f3b",
				label: "Contentpartner: Aanvragen eigen bezoekersruimte bekijken",
				name: "CAN_READ_CP_VISIT_REQUESTS"
			},
			{
				id: "3b2afc9a-f453-47a0-94fb-c1f1e33435a3",
				label: "Gebruiker: Eigen aanvragen bekijken",
				name: "CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS"
			}
		]
	}
};

export const userGroupDataMock: UserGroup[] = [
	{
		label: "Contentpartner medewerker",
		id: "c56d95aa-e918-47ca-b102-486c9449fc4a",
		created_at: "2022-03-04T12:01:45.68009",
		description: "Kan een leeszaal beheren en aanvragen verwerken.",
		updated_at: "2022-03-21T08:59:28.25238",
		permissions: [
			Permission.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
			Permission.CAN_READ_CP_VISIT_REQUESTS,
			Permission.CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		],
	},
	{
		label: "Gebruiker",
		id: "0213c8d4-f459-45ef-8bbc-96268ab56d01",
		created_at: "2022-03-04T11:39:52.137254",
		description: "Een geregistreerde gebruiker.",
		updated_at: "2022-03-04T11:39:52.137254",
		permissions: [
			Permission.CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		],
	},
	{
		label: "Kioskgebruiker",
		id: "04150e6e-b779-4125-84e5-6ee6fc580757",
		created_at: "2022-03-04T11:39:52.137254",
		description: "Anoniem profiel om mee aan te melden op een terminal of kiosk in de bezoekersruimte van een CP.",
		updated_at: "2022-03-04T11:39:52.137254",
		permissions: [],
	},
	{
		label: "Sitebeheerder",
		id: "0b281484-76cd-45a9-b6ce-68a0ea7f4b26",
		created_at: "2022-03-04T12:01:45.68009",
		description: "Kan de hele applicatie beheren, doorgaans een meemoo-medewerker.",
		updated_at: "2022-03-04T12:01:45.68009",
		permissions: [
			Permission.CAN_APPROVE_DENY_ALL_VISIT_REQUESTS,
			Permission.CAN_READ_ALL_VISIT_REQUESTS,
			Permission.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
			Permission.CAN_READ_CP_VISIT_REQUESTS,
			Permission.CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		],
	}
];
