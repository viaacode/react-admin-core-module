import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
	DeleteContentBlockDocument as DeleteContentBlockDocumentAvo,
	DeleteContentBlockMutation as DeleteContentBlockMutationAvo,
	DeleteContentBlockMutationVariables as DeleteContentBlockMutationVariablesAvo,
	DeleteContentLabelLinksDocument as DeleteContentLabelLinksDocumentAvo,
	DeleteContentLabelLinksMutation as DeleteContentLabelLinksMutationAvo,
	DeleteContentLabelLinksMutationVariables as DeleteContentLabelLinksMutationVariablesAvo,
	GetContentByIdDocument as GetContentByIdDocumentAvo,
	GetContentByIdQuery as GetContentByIdQueryAvo,
	GetContentByIdQueryVariables as GetContentByIdQueryVariablesAvo,
	GetContentByIdsDocument as GetContentByIdsDocumentAvo,
	GetContentByIdsQuery as GetContentByIdsQueryAvo,
	GetContentByIdsQueryVariables as GetContentByIdsQueryVariablesAvo,
	GetContentLabelsByContentTypeDocument as GetContentLabelsByContentTypeDocumentAvo,
	GetContentLabelsByContentTypeQuery as GetContentLabelsByContentTypeQueryAvo,
	GetContentLabelsByContentTypeQueryVariables as GetContentLabelsByContentTypeQueryVariablesAvo,
	GetContentPageByPathDocument as GetContentPageByPathDocumentAvo,
	GetContentPageByPathQuery as GetContentPageByPathQueryAvo,
	GetContentPageByPathQueryVariables as GetContentPageByPathQueryVariablesAvo,
	GetContentPagesDocument as GetContentPagesDocumentAvo,
	GetContentPagesQuery as GetContentPagesQueryAvo,
	GetContentPagesQueryVariables as GetContentPagesQueryVariablesAvo,
	GetContentPagesWithBlocksDocument as GetContentPagesWithBlocksDocumentAvo,
	GetContentPagesWithBlocksQuery as GetContentPagesWithBlocksQueryAvo,
	GetContentPagesWithBlocksQueryVariables as GetContentPagesWithBlocksQueryVariablesAvo,
	GetContentTypesDocument as GetContentTypesDocumentAvo,
	GetContentTypesQuery as GetContentTypesQueryAvo,
	GetContentTypesQueryVariables as GetContentTypesQueryVariablesAvo,
	GetPermissionsFromContentPageByPathDocument as GetPermissionsFromContentPageByPathDocumentAvo,
	GetPermissionsFromContentPageByPathQuery as GetPermissionsFromContentPageByPathQueryAvo,
	GetPermissionsFromContentPageByPathQueryVariables as GetPermissionsFromContentPageByPathQueryVariablesAvo,
	GetPublicContentPagesByTitleDocument as GetPublicContentPagesByTitleDocumentAvo,
	GetPublicContentPagesByTitleQuery as GetPublicContentPagesByTitleQueryAvo,
	GetPublicContentPagesByTitleQueryVariables as GetPublicContentPagesByTitleQueryVariablesAvo,
	GetPublicContentPagesDocument as GetPublicContentPagesDocumentAvo,
	GetPublicContentPagesQuery as GetPublicContentPagesQueryAvo,
	GetPublicContentPagesQueryVariables as GetPublicContentPagesQueryVariablesAvo,
	GetPublicProjectContentPagesByTitleDocument as GetPublicProjectContentPagesByTitleDocumentAvo,
	GetPublicProjectContentPagesByTitleQuery as GetPublicProjectContentPagesByTitleQueryAvo,
	GetPublicProjectContentPagesByTitleQueryVariables as GetPublicProjectContentPagesByTitleQueryVariablesAvo,
	GetPublicProjectContentPagesDocument as GetPublicProjectContentPagesDocumentAvo,
	GetPublicProjectContentPagesQuery as GetPublicProjectContentPagesQueryAvo,
	GetPublicProjectContentPagesQueryVariables as GetPublicProjectContentPagesQueryVariablesAvo,
	InsertContentBlocksDocument as InsertContentBlocksDocumentAvo,
	InsertContentBlocksMutation as InsertContentBlocksMutationAvo,
	InsertContentBlocksMutationVariables as InsertContentBlocksMutationVariablesAvo,
	InsertContentDocument as InsertContentDocumentAvo,
	InsertContentLabelLinksDocument as InsertContentLabelLinksDocumentAvo,
	InsertContentLabelLinksMutation as InsertContentLabelLinksMutationAvo,
	InsertContentLabelLinksMutationVariables as InsertContentLabelLinksMutationVariablesAvo,
	InsertContentMutation as InsertContentMutationAvo,
	InsertContentMutationVariables as InsertContentMutationVariablesAvo,
	SoftDeleteContentDocument as SoftDeleteContentDocumentAvo,
	SoftDeleteContentMutation as SoftDeleteContentMutationAvo,
	SoftDeleteContentMutationVariables as SoftDeleteContentMutationVariablesAvo,
	UpdateContentBlockDocument as UpdateContentBlockDocumentAvo,
	UpdateContentBlockMutation as UpdateContentBlockMutationAvo,
	UpdateContentBlockMutationVariables as UpdateContentBlockMutationVariablesAvo,
	UpdateContentByIdDocument as UpdateContentByIdDocumentAvo,
	UpdateContentByIdMutation as UpdateContentByIdMutationAvo,
	UpdateContentByIdMutationVariables as UpdateContentByIdMutationVariablesAvo,
	UpdateContentPagePublishDatesDocument as UpdateContentPagePublishDatesDocumentAvo,
	UpdateContentPagePublishDatesMutation as UpdateContentPagePublishDatesMutationAvo,
	UpdateContentPagePublishDatesMutationVariables as UpdateContentPagePublishDatesMutationVariablesAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	DeleteContentBlockDocument as DeleteContentBlockDocumentHetArchief,
	DeleteContentBlockMutation as DeleteContentBlockMutationHetArchief,
	DeleteContentBlockMutationVariables as DeleteContentBlockMutationVariablesHetArchief,
	DeleteContentLabelLinksDocument as DeleteContentLabelLinksDocumentHetArchief,
	DeleteContentLabelLinksMutation as DeleteContentLabelLinksMutationHetArchief,
	DeleteContentLabelLinksMutationVariables as DeleteContentLabelLinksMutationVariablesHetArchief,
	GetContentByIdDocument as GetContentByIdDocumentHetArchief,
	GetContentByIdQuery as GetContentByIdQueryHetArchief,
	GetContentByIdQueryVariables as GetContentByIdQueryVariablesHetArchief,
	GetContentByIdsDocument as GetContentByIdsDocumentHetArchief,
	GetContentByIdsQuery as GetContentByIdsQueryHetArchief,
	GetContentByIdsQueryVariables as GetContentByIdsQueryVariablesHetArchief,
	GetContentLabelsByContentTypeDocument as GetContentLabelsByContentTypeDocumentHetArchief,
	GetContentLabelsByContentTypeQuery as GetContentLabelsByContentTypeQueryHetArchief,
	GetContentLabelsByContentTypeQueryVariables as GetContentLabelsByContentTypeQueryVariablesHetArchief,
	GetContentPageByPathDocument as GetContentPageByPathDocumentHetArchief,
	GetContentPageByPathQuery as GetContentPageByPathQueryHetArchief,
	GetContentPageByPathQueryVariables as GetContentPageByPathQueryVariablesHetArchief,
	GetContentPagesDocument as GetContentPagesDocumentHetArchief,
	GetContentPagesQuery as GetContentPagesQueryHetArchief,
	GetContentPagesQueryVariables as GetContentPagesQueryVariablesHetArchief,
	GetContentPagesWithBlocksDocument as GetContentPagesWithBlocksDocumentHetArchief,
	GetContentPagesWithBlocksQuery as GetContentPagesWithBlocksQueryHetArchief,
	GetContentPagesWithBlocksQueryVariables as GetContentPagesWithBlocksQueryVariablesHetArchief,
	GetContentTypesDocument as GetContentTypesDocumentHetArchief,
	GetContentTypesQuery as GetContentTypesQueryHetArchief,
	GetContentTypesQueryVariables as GetContentTypesQueryVariablesHetArchief,
	GetPermissionsFromContentPageByPathDocument as GetPermissionsFromContentPageByPathDocumentHetArchief,
	GetPermissionsFromContentPageByPathQuery as GetPermissionsFromContentPageByPathQueryHetArchief,
	GetPermissionsFromContentPageByPathQueryVariables as GetPermissionsFromContentPageByPathQueryVariablesHetArchief,
	GetPublicContentPagesByTitleDocument as GetPublicContentPagesByTitleDocumentHetArchief,
	GetPublicContentPagesByTitleQuery as GetPublicContentPagesByTitleQueryHetArchief,
	GetPublicContentPagesByTitleQueryVariables as GetPublicContentPagesByTitleQueryVariablesHetArchief,
	GetPublicContentPagesDocument as GetPublicContentPagesDocumentHetArchief,
	GetPublicContentPagesQuery as GetPublicContentPagesQueryHetArchief,
	GetPublicContentPagesQueryVariables as GetPublicContentPagesQueryVariablesHetArchief,
	GetPublicProjectContentPagesByTitleDocument as GetPublicProjectContentPagesByTitleDocumentHetArchief,
	GetPublicProjectContentPagesByTitleQuery as GetPublicProjectContentPagesByTitleQueryHetArchief,
	GetPublicProjectContentPagesByTitleQueryVariables as GetPublicProjectContentPagesByTitleQueryVariablesHetArchief,
	GetPublicProjectContentPagesDocument as GetPublicProjectContentPagesDocumentHetArchief,
	GetPublicProjectContentPagesQuery as GetPublicProjectContentPagesQueryHetArchief,
	GetPublicProjectContentPagesQueryVariables as GetPublicProjectContentPagesQueryVariablesHetArchief,
	InsertContentBlocksDocument as InsertContentBlocksDocumentHetArchief,
	InsertContentBlocksMutation as InsertContentBlocksMutationHetArchief,
	InsertContentBlocksMutationVariables as InsertContentBlocksMutationVariablesHetArchief,
	InsertContentDocument as InsertContentDocumentHetArchief,
	InsertContentLabelLinksDocument as InsertContentLabelLinksDocumentHetArchief,
	InsertContentLabelLinksMutation as InsertContentLabelLinksMutationHetArchief,
	InsertContentLabelLinksMutationVariables as InsertContentLabelLinksMutationVariablesHetArchief,
	InsertContentMutation as InsertContentMutationHetArchief,
	InsertContentMutationVariables as InsertContentMutationVariablesHetArchief,
	SoftDeleteContentDocument as SoftDeleteContentDocumentHetArchief,
	SoftDeleteContentMutation as SoftDeleteContentMutationHetArchief,
	SoftDeleteContentMutationVariables as SoftDeleteContentMutationVariablesHetArchief,
	UpdateContentBlockDocument as UpdateContentBlockDocumentHetArchief,
	UpdateContentBlockMutation as UpdateContentBlockMutationHetArchief,
	UpdateContentBlockMutationVariables as UpdateContentBlockMutationVariablesHetArchief,
	UpdateContentByIdDocument as UpdateContentByIdDocumentHetArchief,
	UpdateContentByIdMutation as UpdateContentByIdMutationHetArchief,
	UpdateContentByIdMutationVariables as UpdateContentByIdMutationVariablesHetArchief,
	UpdateContentPagePublishDatesDocument as UpdateContentPagePublishDatesDocumentHetArchief,
	UpdateContentPagePublishDatesMutation as UpdateContentPagePublishDatesMutationHetArchief,
	UpdateContentPagePublishDatesMutationVariables as UpdateContentPagePublishDatesMutationVariablesHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { DatabaseType } from '@viaa/avo2-types';

export type ContentPageQueryTypes = {
	GetContentByIdQuery: GetContentByIdQueryAvo | GetContentByIdQueryHetArchief;
	GetContentByIdQueryHetArchief: GetContentByIdQueryHetArchief;
	GetContentByIdQueryAvo: GetContentByIdQueryAvo;
	GetContentLabelsByContentTypeQueryAvo: GetContentLabelsByContentTypeQueryAvo;
	GetContentLabelsByContentTypeQueryHetArchief: GetContentLabelsByContentTypeQueryHetArchief;
	GetContentLabelsByContentTypeQuery:
		| GetContentLabelsByContentTypeQueryAvo
		| GetContentLabelsByContentTypeQueryHetArchief;
	GetContentPagesQueryAvo: GetContentPagesQueryAvo;
	GetContentPagesQueryHetArchief: GetContentPagesQueryHetArchief;
	GetContentPagesQuery:
		| GetContentPagesQueryAvo
		| GetContentPagesQueryHetArchief;
	GetContentTypesQueryAvo: GetContentTypesQueryAvo;
	GetContentTypesQueryHetArchief: GetContentTypesQueryHetArchief;
	GetContentTypesQuery:
		| GetContentTypesQueryAvo
		| GetContentTypesQueryHetArchief;
	GetPermissionsFromContentPageByPathQueryAvo: GetPermissionsFromContentPageByPathQueryAvo;
	GetPermissionsFromContentPageByPathQueryHetArchief: GetPermissionsFromContentPageByPathQueryHetArchief;
	GetPermissionsFromContentPageByPathQuery:
		| GetPermissionsFromContentPageByPathQueryAvo
		| GetPermissionsFromContentPageByPathQueryHetArchief;
	GetPublicContentPagesByTitleQueryAvo: GetPublicContentPagesByTitleQueryAvo;
	GetPublicContentPagesByTitleQueryHetArchief: GetPublicContentPagesByTitleQueryHetArchief;
	GetPublicContentPagesByTitleQuery:
		| GetPublicContentPagesByTitleQueryAvo
		| GetPublicContentPagesByTitleQueryHetArchief;
	GetPublicProjectContentPagesByTitleQueryAvo: GetPublicProjectContentPagesByTitleQueryAvo;
	GetPublicProjectContentPagesByTitleQueryHetArchief: GetPublicProjectContentPagesByTitleQueryHetArchief;
	GetPublicProjectContentPagesByTitleQuery:
		| GetPublicProjectContentPagesByTitleQueryAvo
		| GetPublicProjectContentPagesByTitleQueryHetArchief;
	GetPublicProjectContentPagesQueryAvo: GetPublicProjectContentPagesQueryAvo;
	GetPublicProjectContentPagesQueryHetArchief: GetPublicProjectContentPagesQueryHetArchief;
	GetPublicProjectContentPagesQuery:
		| GetPublicProjectContentPagesQueryAvo
		| GetPublicProjectContentPagesQueryHetArchief;
	GetContentByIdQueryVariablesAvo: GetContentByIdQueryVariablesAvo;
	GetContentByIdQueryVariablesHetArchief: GetContentByIdQueryVariablesHetArchief;
	GetContentByIdQueryVariables:
		| GetContentByIdQueryVariablesAvo
		| GetContentByIdQueryVariablesHetArchief;
	GetContentLabelsByContentTypeQueryVariablesAvo: GetContentLabelsByContentTypeQueryVariablesAvo;
	GetContentLabelsByContentTypeQueryVariablesHetArchief: GetContentLabelsByContentTypeQueryVariablesHetArchief;
	GetContentLabelsByContentTypeQueryVariables:
		| GetContentLabelsByContentTypeQueryVariablesAvo
		| GetContentLabelsByContentTypeQueryVariablesHetArchief;
	GetContentPagesQueryVariablesAvo: GetContentPagesQueryVariablesAvo;
	GetContentPagesQueryVariablesHetArchief: GetContentPagesQueryVariablesHetArchief;
	GetContentPagesQueryVariables:
		| GetContentPagesQueryVariablesAvo
		| GetContentPagesQueryVariablesHetArchief;
	GetContentTypesQueryVariablesAvo: GetContentTypesQueryVariablesAvo;
	GetContentTypesQueryVariablesHetArchief: GetContentTypesQueryVariablesHetArchief;
	GetContentTypesQueryVariables:
		| GetContentTypesQueryVariablesAvo
		| GetContentTypesQueryVariablesHetArchief;
	GetPermissionsFromContentPageByPathQueryVariablesAvo: GetPermissionsFromContentPageByPathQueryVariablesAvo;
	GetPermissionsFromContentPageByPathQueryVariablesHetArchief: GetPermissionsFromContentPageByPathQueryVariablesHetArchief;
	GetPermissionsFromContentPageByPathQueryVariables:
		| GetPermissionsFromContentPageByPathQueryVariablesAvo
		| GetPermissionsFromContentPageByPathQueryVariablesHetArchief;
	GetPublicContentPagesByTitleQueryVariablesAvo: GetPublicContentPagesByTitleQueryVariablesAvo;
	GetPublicContentPagesByTitleQueryVariablesHetArchief: GetPublicContentPagesByTitleQueryVariablesHetArchief;
	GetPublicContentPagesByTitleQueryVariables:
		| GetPublicContentPagesByTitleQueryVariablesAvo
		| GetPublicContentPagesByTitleQueryVariablesHetArchief;
	GetPublicProjectContentPagesByTitleQueryVariablesAvo: GetPublicProjectContentPagesByTitleQueryVariablesAvo;
	GetPublicProjectContentPagesByTitleQueryVariablesHetArchief: GetPublicProjectContentPagesByTitleQueryVariablesHetArchief;
	GetPublicProjectContentPagesByTitleQueryVariables:
		| GetPublicProjectContentPagesByTitleQueryVariablesAvo
		| GetPublicProjectContentPagesByTitleQueryVariablesHetArchief;
	GetPublicProjectContentPagesQueryVariablesAvo: GetPublicProjectContentPagesQueryVariablesAvo;
	GetPublicProjectContentPagesQueryVariablesHetArchief: GetPublicProjectContentPagesQueryVariablesHetArchief;
	GetPublicProjectContentPagesQueryVariables:
		| GetPublicProjectContentPagesQueryVariablesAvo
		| GetPublicProjectContentPagesQueryVariablesHetArchief;
	DeleteContentBlockMutationAvo: DeleteContentBlockMutationAvo;
	DeleteContentBlockMutationHetArchief: DeleteContentBlockMutationHetArchief;
	DeleteContentBlockMutation:
		| DeleteContentBlockMutationAvo
		| DeleteContentBlockMutationHetArchief;
	DeleteContentLabelLinksMutationAvo: DeleteContentLabelLinksMutationAvo;
	DeleteContentLabelLinksMutationHetArchief: DeleteContentLabelLinksMutationHetArchief;
	DeleteContentLabelLinksMutation:
		| DeleteContentLabelLinksMutationAvo
		| DeleteContentLabelLinksMutationHetArchief;
	InsertContentBlocksMutationAvo: InsertContentBlocksMutationAvo;
	InsertContentBlocksMutationHetArchief: InsertContentBlocksMutationHetArchief;
	InsertContentBlocksMutation:
		| InsertContentBlocksMutationAvo
		| InsertContentBlocksMutationHetArchief;
	InsertContentMutationAvo: InsertContentMutationAvo;
	InsertContentMutationHetArchief: InsertContentMutationHetArchief;
	InsertContentMutation:
		| InsertContentMutationAvo
		| InsertContentMutationHetArchief;
	InsertContentLabelLinksMutationAvo: InsertContentLabelLinksMutationAvo;
	InsertContentLabelLinksMutationHetArchief: InsertContentLabelLinksMutationHetArchief;
	InsertContentLabelLinksMutation:
		| InsertContentLabelLinksMutationAvo
		| InsertContentLabelLinksMutationHetArchief;
	SoftDeleteContentMutationAvo: SoftDeleteContentMutationAvo;
	SoftDeleteContentMutationHetArchief: SoftDeleteContentMutationHetArchief;
	SoftDeleteContentMutation:
		| SoftDeleteContentMutationAvo
		| SoftDeleteContentMutationHetArchief;
	UpdateContentBlockMutationAvo: UpdateContentBlockMutationAvo;
	UpdateContentBlockMutationHetArchief: UpdateContentBlockMutationHetArchief;
	UpdateContentBlockMutation:
		| UpdateContentBlockMutationAvo
		| UpdateContentBlockMutationHetArchief;
	UpdateContentByIdMutationAvo: UpdateContentByIdMutationAvo;
	UpdateContentByIdMutationHetArchief: UpdateContentByIdMutationHetArchief;
	UpdateContentByIdMutation:
		| UpdateContentByIdMutationAvo
		| UpdateContentByIdMutationHetArchief;
	DeleteContentBlockMutationVariablesAvo: DeleteContentBlockMutationVariablesAvo;
	DeleteContentBlockMutationVariablesHetArchief: DeleteContentBlockMutationVariablesHetArchief;
	DeleteContentBlockMutationVariables:
		| DeleteContentBlockMutationVariablesAvo
		| DeleteContentBlockMutationVariablesHetArchief;
	DeleteContentLabelLinksMutationVariablesAvo: DeleteContentLabelLinksMutationVariablesAvo;
	DeleteContentLabelLinksMutationVariablesHetArchief: DeleteContentLabelLinksMutationVariablesHetArchief;
	DeleteContentLabelLinksMutationVariables:
		| DeleteContentLabelLinksMutationVariablesAvo
		| DeleteContentLabelLinksMutationVariablesHetArchief;
	InsertContentBlocksMutationVariablesAvo: InsertContentBlocksMutationVariablesAvo;
	InsertContentBlocksMutationVariablesHetArchief: InsertContentBlocksMutationVariablesHetArchief;
	InsertContentBlocksMutationVariables:
		| InsertContentBlocksMutationVariablesAvo
		| InsertContentBlocksMutationVariablesHetArchief;
	InsertContentMutationVariablesAvo: InsertContentMutationVariablesAvo;
	InsertContentMutationVariablesHetArchief: InsertContentMutationVariablesHetArchief;
	InsertContentMutationVariables:
		| InsertContentMutationVariablesAvo
		| InsertContentMutationVariablesHetArchief;
	InsertContentLabelLinksMutationVariablesAvo: InsertContentLabelLinksMutationVariablesAvo;
	InsertContentLabelLinksMutationVariablesHetArchief: InsertContentLabelLinksMutationVariablesHetArchief;
	InsertContentLabelLinksMutationVariables:
		| InsertContentLabelLinksMutationVariablesAvo
		| InsertContentLabelLinksMutationVariablesHetArchief;
	SoftDeleteContentMutationVariablesAvo: SoftDeleteContentMutationVariablesAvo;
	SoftDeleteContentMutationVariablesHetArchief: SoftDeleteContentMutationVariablesHetArchief;
	SoftDeleteContentMutationVariables:
		| SoftDeleteContentMutationVariablesAvo
		| SoftDeleteContentMutationVariablesHetArchief;
	UpdateContentBlockMutationVariablesAvo: UpdateContentBlockMutationVariablesAvo;
	UpdateContentBlockMutationVariablesHetArchief: UpdateContentBlockMutationVariablesHetArchief;
	UpdateContentBlockMutationVariables:
		| UpdateContentBlockMutationVariablesAvo
		| UpdateContentBlockMutationVariablesHetArchief;
	UpdateContentByIdMutationVariablesAvo: UpdateContentByIdMutationVariablesAvo;
	UpdateContentByIdMutationVariablesHetArchief: UpdateContentByIdMutationVariablesHetArchief;
	UpdateContentByIdMutationVariables:
		| UpdateContentByIdMutationVariablesAvo
		| UpdateContentByIdMutationVariablesHetArchief;
	GetContentByIdsQueryAvo: GetContentByIdsQueryAvo;
	GetContentByIdsQueryHetArchief: GetContentByIdsQueryHetArchief;
	GetContentByIdsQuery:
		| GetContentByIdsQueryAvo
		| GetContentByIdsQueryHetArchief;
	GetContentPageByPathQueryAvo: GetContentPageByPathQueryAvo;
	GetContentPageByPathQueryHetArchief: GetContentPageByPathQueryHetArchief;
	GetContentPageByPathQuery:
		| GetContentPageByPathQueryAvo
		| GetContentPageByPathQueryHetArchief;
	GetContentPagesWithBlocksQueryAvo: GetContentPagesWithBlocksQueryAvo;
	GetContentPagesWithBlocksQueryHetArchief: GetContentPagesWithBlocksQueryHetArchief;
	GetContentPagesWithBlocksQuery:
		| GetContentPagesWithBlocksQueryAvo
		| GetContentPagesWithBlocksQueryHetArchief;
	GetPublicContentPagesQueryAvo: GetPublicContentPagesQueryAvo;
	GetPublicContentPagesQueryHetArchief: GetPublicContentPagesQueryHetArchief;
	GetPublicContentPagesQuery:
		| GetPublicContentPagesQueryAvo
		| GetPublicContentPagesQueryHetArchief;
	UpdateContentPagePublishDatesMutationAvo: UpdateContentPagePublishDatesMutationAvo;
	UpdateContentPagePublishDatesMutationHetArchief: UpdateContentPagePublishDatesMutationHetArchief;
	UpdateContentPagePublishDatesMutation:
		| UpdateContentPagePublishDatesMutationAvo
		| UpdateContentPagePublishDatesMutationHetArchief;

	GetContentByIdsQueryVariablesAvo: GetContentByIdsQueryVariablesAvo;
	GetContentByIdsQueryVariablesHetArchief: GetContentByIdsQueryVariablesHetArchief;
	GetContentByIdsQueryVariables:
		| GetContentByIdsQueryVariablesAvo
		| GetContentByIdsQueryVariablesHetArchief;
	GetContentPageByPathQueryVariablesAvo: GetContentPageByPathQueryVariablesAvo;
	GetContentPageByPathQueryVariablesHetArchief: GetContentPageByPathQueryVariablesHetArchief;
	GetContentPageByPathQueryVariables:
		| GetContentPageByPathQueryVariablesAvo
		| GetContentPageByPathQueryVariablesHetArchief;
	GetContentPagesWithBlocksQueryVariablesAvo: GetContentPagesWithBlocksQueryVariablesAvo;
	GetContentPagesWithBlocksQueryVariablesHetArchief: GetContentPagesWithBlocksQueryVariablesHetArchief;
	GetContentPagesWithBlocksQueryVariables:
		| GetContentPagesWithBlocksQueryVariablesAvo
		| GetContentPagesWithBlocksQueryVariablesHetArchief;
	GetPublicContentPagesQueryVariablesAvo: GetPublicContentPagesQueryVariablesAvo;
	GetPublicContentPagesQueryVariablesHetArchief: GetPublicContentPagesQueryVariablesHetArchief;
	GetPublicContentPagesQueryVariables:
		| GetPublicContentPagesQueryVariablesAvo
		| GetPublicContentPagesQueryVariablesHetArchief;
	UpdateContentPagePublishDatesMutationVariablesAvo: UpdateContentPagePublishDatesMutationVariablesAvo;
	UpdateContentPagePublishDatesMutationVariablesHetArchief: UpdateContentPagePublishDatesMutationVariablesHetArchief;
	UpdateContentPagePublishDatesMutationVariables:
		| UpdateContentPagePublishDatesMutationVariablesAvo
		| UpdateContentPagePublishDatesMutationVariablesHetArchief;
};

type ContentPageQueries = {
	DeleteContentBlockDocument: TypedDocumentNode;
	DeleteContentLabelLinksDocument: TypedDocumentNode;
	GetContentByIdDocument: TypedDocumentNode;
	GetContentLabelsByContentTypeDocument: TypedDocumentNode;
	GetContentPagesDocument: TypedDocumentNode;
	GetContentTypesDocument: TypedDocumentNode;
	GetPermissionsFromContentPageByPathDocument: TypedDocumentNode;
	GetPublicContentPagesByTitleDocument: TypedDocumentNode;
	GetPublicProjectContentPagesByTitleDocument: TypedDocumentNode;
	GetPublicProjectContentPagesDocument: TypedDocumentNode;
	InsertContentBlocksDocument: TypedDocumentNode;
	InsertContentDocument: TypedDocumentNode;
	InsertContentLabelLinksDocument: TypedDocumentNode;
	SoftDeleteContentDocument: TypedDocumentNode;
	UpdateContentBlockDocument: TypedDocumentNode;
	UpdateContentByIdDocument: TypedDocumentNode;
	GetContentByIdsDocument: TypedDocumentNode;
	GetContentPageByPathDocument: TypedDocumentNode;
	GetContentPagesWithBlocksDocument: TypedDocumentNode;
	GetPublicContentPagesDocument: TypedDocumentNode;
	UpdateContentPagePublishDatesDocument: TypedDocumentNode;
};

export const CONTENT_PAGE_QUERIES: Record<DatabaseType, ContentPageQueries> = {
	[DatabaseType.avo]: {
		DeleteContentBlockDocument: DeleteContentBlockDocumentAvo,
		DeleteContentLabelLinksDocument: DeleteContentLabelLinksDocumentAvo,
		GetContentByIdDocument: GetContentByIdDocumentAvo,
		GetContentLabelsByContentTypeDocument:
		GetContentLabelsByContentTypeDocumentAvo,
		GetContentPagesDocument: GetContentPagesDocumentAvo,
		GetContentTypesDocument: GetContentTypesDocumentAvo,
		GetPermissionsFromContentPageByPathDocument:
		GetPermissionsFromContentPageByPathDocumentAvo,
		GetPublicContentPagesByTitleDocument:
		GetPublicContentPagesByTitleDocumentAvo,
		GetPublicProjectContentPagesByTitleDocument:
		GetPublicProjectContentPagesByTitleDocumentAvo,
		GetPublicProjectContentPagesDocument:
		GetPublicProjectContentPagesDocumentAvo,
		InsertContentBlocksDocument: InsertContentBlocksDocumentAvo,
		InsertContentDocument: InsertContentDocumentAvo,
		InsertContentLabelLinksDocument: InsertContentLabelLinksDocumentAvo,
		SoftDeleteContentDocument: SoftDeleteContentDocumentAvo,
		UpdateContentBlockDocument: UpdateContentBlockDocumentAvo,
		UpdateContentByIdDocument: UpdateContentByIdDocumentAvo,
		GetContentByIdsDocument: GetContentByIdsDocumentAvo,
		GetContentPageByPathDocument: GetContentPageByPathDocumentAvo,
		GetContentPagesWithBlocksDocument: GetContentPagesWithBlocksDocumentAvo,
		GetPublicContentPagesDocument: GetPublicContentPagesDocumentAvo,
		UpdateContentPagePublishDatesDocument:
		UpdateContentPagePublishDatesDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		DeleteContentBlockDocument: DeleteContentBlockDocumentHetArchief,
		DeleteContentLabelLinksDocument: DeleteContentLabelLinksDocumentHetArchief,
		GetContentByIdDocument: GetContentByIdDocumentHetArchief,
		GetContentLabelsByContentTypeDocument:
		GetContentLabelsByContentTypeDocumentHetArchief,
		GetContentPagesDocument: GetContentPagesDocumentHetArchief,
		GetContentTypesDocument: GetContentTypesDocumentHetArchief,
		GetPermissionsFromContentPageByPathDocument:
		GetPermissionsFromContentPageByPathDocumentHetArchief,
		GetPublicContentPagesByTitleDocument:
		GetPublicContentPagesByTitleDocumentHetArchief,
		GetPublicProjectContentPagesByTitleDocument:
		GetPublicProjectContentPagesByTitleDocumentHetArchief,
		GetPublicProjectContentPagesDocument:
		GetPublicProjectContentPagesDocumentHetArchief,
		InsertContentBlocksDocument: InsertContentBlocksDocumentHetArchief,
		InsertContentDocument: InsertContentDocumentHetArchief,
		InsertContentLabelLinksDocument: InsertContentLabelLinksDocumentHetArchief,
		SoftDeleteContentDocument: SoftDeleteContentDocumentHetArchief,
		UpdateContentBlockDocument: UpdateContentBlockDocumentHetArchief,
		UpdateContentByIdDocument: UpdateContentByIdDocumentHetArchief,
		GetContentByIdsDocument: GetContentByIdsDocumentHetArchief,
		GetContentPageByPathDocument: GetContentPageByPathDocumentHetArchief,
		GetContentPagesWithBlocksDocument:
		GetContentPagesWithBlocksDocumentHetArchief,
		GetPublicContentPagesDocument: GetPublicContentPagesDocumentHetArchief,
		UpdateContentPagePublishDatesDocument:
		UpdateContentPagePublishDatesDocumentHetArchief,
	},
};
