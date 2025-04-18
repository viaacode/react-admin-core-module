import { type ContentPageLabel, type LabelObj } from '../../content-pages/content-pages.types';
import { LinkTarget } from '../../navigations';
import {
	type GetContentPageLabelByIdQuery,
	type GetContentPageLabelsQuery,
	Lookup_App_Content_Type_Enum,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { Locale } from '../../translations';
import { type ContentPageLabelDto } from '../dto/content-page-label.dto';

export const mockGqlContentPageLabel1: GetContentPageLabelsQuery['app_content_label'][0] = {
	label: 'Gebruik van het materiaal',
	content_type: Lookup_App_Content_Type_Enum.FaqItem,
	language: Locale.Nl,
	link_to: {
		type: 'INTERNAL_LINK',
		value: '/faq?label=Gebruik%20van%20het%20materiaal',
		target: '_self',
	},
	created_at: '2022-05-17T08:47:49.271562',
	updated_at: '2022-05-17T08:47:49.271562',
	id: '13d00f95-5597-4470-b5ce-d3ee96212ff4',
};

export const mockGqlContentPageLabel2: GetContentPageLabelByIdQuery['app_content_label'][0] = {
	label: 'Gebruik van het materiaal',
	content_type: Lookup_App_Content_Type_Enum.FaqItem,
	language: Locale.Nl,
	link_to: {
		type: 'INTERNAL_LINK',
		value: '/faq?label=Gebruik%20van%20het%20materiaal',
		target: '_self',
	},
	created_at: '2022-05-17T08:47:49.271562',
	updated_at: '2022-05-17T08:47:49.271562',
	id: '13d00f95-5597-4470-b5ce-d3ee96212ff4',
};

export const mockContentPageLabel1: ContentPageLabel = {
	label: 'Gebruik van het materiaal',
	content_type: Lookup_App_Content_Type_Enum.FaqItem,
	id: '13d00f95-5597-4470-b5ce-d3ee96212ff4',
	//id: 1,
	language: Locale.Nl,
	link_to: {
		type: 'INTERNAL_LINK',
		value: '/faq?label=Gebruik%20van%20het%20materiaal',
		target: LinkTarget.SELF,
	},
	created_at: '2022-05-17T08:47:49.271562',
	updated_at: '2022-05-17T08:47:49.271562',
};

export const mockContentPageLabelDto: ContentPageLabelDto = {
	label: 'Gebruik van het materiaal',
	content_type: Lookup_App_Content_Type_Enum.FaqItem,
	id: '13d00f95-5597-4470-b5ce-d3ee96212ff4',
	language: Locale.Nl,
	link_to: {
		type: 'INTERNAL_LINK',
		value: '/faq?label=Gebruik%20van%20het%20materiaal',
		target: LinkTarget.SELF,
	},
	created_at: '2022-05-17T08:47:49.271562',
	updated_at: '2022-05-17T08:47:49.271562',
};

export const mockLabelObj: LabelObj = {
	label: 'Gebruik van het materiaal',
	id: '13d00f95-5597-4470-b5ce-d3ee96212ff4',
};

export const mockContentPageLabelsFilteredResponse = [mockLabelObj];

export const mockContentPageLabelsResponse = [[mockContentPageLabel1], 1];
