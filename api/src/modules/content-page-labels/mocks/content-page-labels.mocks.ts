// export const fetchContentPageLabelsQuery = {
// 	offset: '0',
// 	limit: '20',
// 	sortColumn: 'label',
// 	sortOrder: 'asc',
// 	where: '{}',
// }

import { Lookup_App_Content_Type_Enum } from '../../../../dist/src/modules/shared/generated/graphql-db-types-hetarchief';
import { ContentPageLabel } from '../../content-pages/content-pages.types';

const mockContentPageLabel1: ContentPageLabel = {
	label: 'Gebruik van het materiaal',
	content_type: Lookup_App_Content_Type_Enum.FaqItem,
	id: '13d00f95-5597-4470-b5ce-d3ee96212ff4',
	//id: 1,
	link_to: {
		type: 'INTERNAL_LINK',
		value: '/faq?label=Gebruik%20van%20het%20materiaal',
		target: '_self',
	},
	created_at: '2022-05-17T08:47:49.271562',
	updated_at: '2022-05-17T08:47:49.271562',
};

export const mockContentPageLabelsResponse = [[mockContentPageLabel1], 1];
