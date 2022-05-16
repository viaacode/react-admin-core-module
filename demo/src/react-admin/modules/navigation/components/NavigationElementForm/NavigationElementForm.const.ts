import { array, number, object, string } from 'yup';

export const NAVIGATION_ELEMENT_FORM_SCHEMA = object({
	label: string(),
	icon_name: string(),
	description: string(),
	user_group_ids: array().of(number()),
	content_type: string(),
	content_path: string(),
	placement: string(),
	tooltip: string(),
});
