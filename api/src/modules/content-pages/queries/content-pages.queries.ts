import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DatabaseType } from '@viaa/avo2-types';

import {
	DeleteContentBlockDocument as DeleteContentBlockDocumentAvo,
	type DeleteContentBlockMutation as DeleteContentBlockMutationAvo,
	type DeleteContentBlockMutationVariables as DeleteContentBlockMutationVariablesAvo,
	DeleteContentLabelLinksDocument as DeleteContentLabelLinksDocumentAvo,
	type DeleteContentLabelLinksMutation as DeleteContentLabelLinksMutationAvo,
	type DeleteContentLabelLinksMutationVariables as DeleteContentLabelLinksMutationVariablesAvo,
	GetContentByIdDocument as GetContentByIdDocumentAvo,
	type GetContentByIdQuery as GetContentByIdQueryAvo,
	type GetContentByIdQueryVariables as GetContentByIdQueryVariablesAvo,
	GetContentByIdsDocument as GetContentByIdsDocumentAvo,
	type GetContentByIdsQuery as GetContentByIdsQueryAvo,
	type GetContentByIdsQueryVariables as GetContentByIdsQueryVariablesAvo,
	GetContentLabelsByContentTypeDocument as GetContentLabelsByContentTypeDocumentAvo,
	type GetContentLabelsByContentTypeQuery as GetContentLabelsByContentTypeQueryAvo,
	type GetContentLabelsByContentTypeQueryVariables as GetContentLabelsByContentTypeQueryVariablesAvo,
	GetContentPageByPathDocument as GetContentPageByPathDocumentAvo,
	type GetContentPageByPathQuery as GetContentPageByPathQueryAvo,
	type GetContentPageByPathQueryVariables as GetContentPageByPathQueryVariablesAvo,
	GetContentPagesDocument as GetContentPagesDocumentAvo,
	type GetContentPagesQuery as GetContentPagesQueryAvo,
	type GetContentPagesQueryVariables as GetContentPagesQueryVariablesAvo,
	GetContentPagesToPublishDocument as GetContentPagesToPublishDocumentAvo,
	type GetContentPagesToPublishQuery as GetContentPagesToPublishQueryAvo,
	type GetContentPagesToPublishQueryVariables as GetContentPagesToPublishQueryVariablesAvo,
	GetContentPagesWithBlocksDocument as GetContentPagesWithBlocksDocumentAvo,
	type GetContentPagesWithBlocksQuery as GetContentPagesWithBlocksQueryAvo,
	type GetContentPagesWithBlocksQueryVariables as GetContentPagesWithBlocksQueryVariablesAvo,
	GetContentTypesDocument as GetContentTypesDocumentAvo,
	type GetContentTypesQuery as GetContentTypesQueryAvo,
	type GetContentTypesQueryVariables as GetContentTypesQueryVariablesAvo,
	GetNlParentContentPagesByTitleDocument as GetNlParentContentPagesByTitleDocumentAvo,
	type GetNlParentContentPagesByTitleQuery as GetNlParentContentPagesByTitleQueryAvo,
	type GetNlParentContentPagesByTitleQueryVariables as GetNlParentContentPagesByTitleQueryVariablesAvo,
	GetNlParentContentPagesDocument as GetNlParentContentPagesDocumentAvo,
	type GetNlParentContentPagesQuery as GetNlParentContentPagesQueryAvo,
	type GetNlParentContentPagesQueryVariables as GetNlParentContentPagesQueryVariablesAvo,
	GetPermissionsFromContentPageByPathDocument as GetPermissionsFromContentPageByPathDocumentAvo,
	type GetPermissionsFromContentPageByPathQuery as GetPermissionsFromContentPageByPathQueryAvo,
	type GetPermissionsFromContentPageByPathQueryVariables as GetPermissionsFromContentPageByPathQueryVariablesAvo,
	GetPublicContentPagesByTitleDocument as GetPublicContentPagesByTitleDocumentAvo,
	type GetPublicContentPagesByTitleQuery as GetPublicContentPagesByTitleQueryAvo,
	type GetPublicContentPagesByTitleQueryVariables as GetPublicContentPagesByTitleQueryVariablesAvo,
	GetPublicContentPagesDocument as GetPublicContentPagesDocumentAvo,
	type GetPublicContentPagesQuery as GetPublicContentPagesQueryAvo,
	type GetPublicContentPagesQueryVariables as GetPublicContentPagesQueryVariablesAvo,
	GetPublicProjectContentPagesByTitleDocument as GetPublicProjectContentPagesByTitleDocumentAvo,
	type GetPublicProjectContentPagesByTitleQuery as GetPublicProjectContentPagesByTitleQueryAvo,
	type GetPublicProjectContentPagesByTitleQueryVariables as GetPublicProjectContentPagesByTitleQueryVariablesAvo,
	GetPublicProjectContentPagesDocument as GetPublicProjectContentPagesDocumentAvo,
	type GetPublicProjectContentPagesQuery as GetPublicProjectContentPagesQueryAvo,
	type GetPublicProjectContentPagesQueryVariables as GetPublicProjectContentPagesQueryVariablesAvo,
	InsertContentBlocksDocument as InsertContentBlocksDocumentAvo,
	type InsertContentBlocksMutation as InsertContentBlocksMutationAvo,
	type InsertContentBlocksMutationVariables as InsertContentBlocksMutationVariablesAvo,
	InsertContentDocument as InsertContentDocumentAvo,
	InsertContentLabelLinksDocument as InsertContentLabelLinksDocumentAvo,
	type InsertContentLabelLinksMutation as InsertContentLabelLinksMutationAvo,
	type InsertContentLabelLinksMutationVariables as InsertContentLabelLinksMutationVariablesAvo,
	type InsertContentMutation as InsertContentMutationAvo,
	type InsertContentMutationVariables as InsertContentMutationVariablesAvo,
	PublishContentPageDocument as PublishContentPageDocumentAvo,
	type PublishContentPageMutation as PublishContentPageMutationAvo,
	type PublishContentPageMutationVariables as PublishContentPageMutationVariablesAvo,
	SoftDeleteContentDocument as SoftDeleteContentDocumentAvo,
	type SoftDeleteContentMutation as SoftDeleteContentMutationAvo,
	type SoftDeleteContentMutationVariables as SoftDeleteContentMutationVariablesAvo,
	UnpublishContentPageDocument as UnpublishContentPageDocumentAvo,
	type UnpublishContentPageMutation as UnpublishContentPageMutationAvo,
	type UnpublishContentPageMutationVariables as UnpublishContentPageMutationVariablesAvo,
	UpdateContentBlockDocument as UpdateContentBlockDocumentAvo,
	type UpdateContentBlockMutation as UpdateContentBlockMutationAvo,
	type UpdateContentBlockMutationVariables as UpdateContentBlockMutationVariablesAvo,
	UpdateContentPageWithBlocksAndLabelsDocument as UpdateContentPageWithBlocksAndLabelsDocumentAvo,
	type UpdateContentPageWithBlocksAndLabelsMutation as UpdateContentPageWithBlocksAndLabelsMutationAvo,
	type UpdateContentPageWithBlocksAndLabelsMutationVariables as UpdateContentPageWithBlocksAndLabelsMutationVariablesAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	DeleteContentBlockDocument as DeleteContentBlockDocumentHetArchief,
	type DeleteContentBlockMutation as DeleteContentBlockMutationHetArchief,
	type DeleteContentBlockMutationVariables as DeleteContentBlockMutationVariablesHetArchief,
	DeleteContentLabelLinksDocument as DeleteContentLabelLinksDocumentHetArchief,
	type DeleteContentLabelLinksMutation as DeleteContentLabelLinksMutationHetArchief,
	type DeleteContentLabelLinksMutationVariables as DeleteContentLabelLinksMutationVariablesHetArchief,
	GetContentByIdDocument as GetContentByIdDocumentHetArchief,
	type GetContentByIdQuery as GetContentByIdQueryHetArchief,
	type GetContentByIdQueryVariables as GetContentByIdQueryVariablesHetArchief,
	GetContentByIdsDocument as GetContentByIdsDocumentHetArchief,
	type GetContentByIdsQuery as GetContentByIdsQueryHetArchief,
	type GetContentByIdsQueryVariables as GetContentByIdsQueryVariablesHetArchief,
	GetContentLabelsByContentTypeDocument as GetContentLabelsByContentTypeDocumentHetArchief,
	type GetContentLabelsByContentTypeQuery as GetContentLabelsByContentTypeQueryHetArchief,
	type GetContentLabelsByContentTypeQueryVariables as GetContentLabelsByContentTypeQueryVariablesHetArchief,
	GetContentPageByPathDocument as GetContentPageByPathDocumentHetArchief,
	type GetContentPageByPathQuery as GetContentPageByPathQueryHetArchief,
	type GetContentPageByPathQueryVariables as GetContentPageByPathQueryVariablesHetArchief,
	GetContentPagesDocument as GetContentPagesDocumentHetArchief,
	type GetContentPagesQuery as GetContentPagesQueryHetArchief,
	type GetContentPagesQueryVariables as GetContentPagesQueryVariablesHetArchief,
	GetContentPagesToPublishDocument as GetContentPagesToPublishDocumentHetArchief,
	type GetContentPagesToPublishQuery as GetContentPagesToPublishQueryHetArchief,
	type GetContentPagesToPublishQueryVariables as GetContentPagesToPublishQueryVariablesHetArchief,
	GetContentPagesWithBlocksDocument as GetContentPagesWithBlocksDocumentHetArchief,
	type GetContentPagesWithBlocksQuery as GetContentPagesWithBlocksQueryHetArchief,
	type GetContentPagesWithBlocksQueryVariables as GetContentPagesWithBlocksQueryVariablesHetArchief,
	GetContentTypesDocument as GetContentTypesDocumentHetArchief,
	type GetContentTypesQuery as GetContentTypesQueryHetArchief,
	type GetContentTypesQueryVariables as GetContentTypesQueryVariablesHetArchief,
	GetNlParentContentPagesByTitleDocument as GetNlParentContentPagesByTitleDocumentHetArchief,
	type GetNlParentContentPagesByTitleQuery as GetNlParentContentPagesByTitleQueryHetArchief,
	type GetNlParentContentPagesByTitleQueryVariables as GetNlParentContentPagesByTitleQueryVariablesHetArchief,
	GetNlParentContentPagesDocument as GetNlParentContentPagesDocumentHetArchief,
	type GetNlParentContentPagesQuery as GetNlParentContentPagesQueryHetArchief,
	type GetNlParentContentPagesQueryVariables as GetNlParentContentPagesQueryVariablesHetArchief,
	GetPermissionsFromContentPageByPathDocument as GetPermissionsFromContentPageByPathDocumentHetArchief,
	type GetPermissionsFromContentPageByPathQuery as GetPermissionsFromContentPageByPathQueryHetArchief,
	type GetPermissionsFromContentPageByPathQueryVariables as GetPermissionsFromContentPageByPathQueryVariablesHetArchief,
	GetPublicContentPagesByTitleDocument as GetPublicContentPagesByTitleDocumentHetArchief,
	type GetPublicContentPagesByTitleQuery as GetPublicContentPagesByTitleQueryHetArchief,
	type GetPublicContentPagesByTitleQueryVariables as GetPublicContentPagesByTitleQueryVariablesHetArchief,
	GetPublicContentPagesDocument as GetPublicContentPagesDocumentHetArchief,
	type GetPublicContentPagesQuery as GetPublicContentPagesQueryHetArchief,
	type GetPublicContentPagesQueryVariables as GetPublicContentPagesQueryVariablesHetArchief,
	GetPublicProjectContentPagesByTitleDocument as GetPublicProjectContentPagesByTitleDocumentHetArchief,
	type GetPublicProjectContentPagesByTitleQuery as GetPublicProjectContentPagesByTitleQueryHetArchief,
	type GetPublicProjectContentPagesByTitleQueryVariables as GetPublicProjectContentPagesByTitleQueryVariablesHetArchief,
	GetPublicProjectContentPagesDocument as GetPublicProjectContentPagesDocumentHetArchief,
	type GetPublicProjectContentPagesQuery as GetPublicProjectContentPagesQueryHetArchief,
	type GetPublicProjectContentPagesQueryVariables as GetPublicProjectContentPagesQueryVariablesHetArchief,
	InsertContentBlocksDocument as InsertContentBlocksDocumentHetArchief,
	type InsertContentBlocksMutation as InsertContentBlocksMutationHetArchief,
	type InsertContentBlocksMutationVariables as InsertContentBlocksMutationVariablesHetArchief,
	InsertContentDocument as InsertContentDocumentHetArchief,
	InsertContentLabelLinksDocument as InsertContentLabelLinksDocumentHetArchief,
	type InsertContentLabelLinksMutation as InsertContentLabelLinksMutationHetArchief,
	type InsertContentLabelLinksMutationVariables as InsertContentLabelLinksMutationVariablesHetArchief,
	type InsertContentMutation as InsertContentMutationHetArchief,
	type InsertContentMutationVariables as InsertContentMutationVariablesHetArchief,
	PublishContentPageDocument as PublishContentPageDocumentHetArchief,
	type PublishContentPageMutationHetArchief as PublishContentPageMutationHetArchief,
	type PublishContentPageMutationVariables as PublishContentPageMutationVariablesHetArchief,
	SoftDeleteContentDocument as SoftDeleteContentDocumentHetArchief,
	type SoftDeleteContentMutation as SoftDeleteContentMutationHetArchief,
	type SoftDeleteContentMutationVariables as SoftDeleteContentMutationVariablesHetArchief,
	UnpublishContentPageDocument as UnpublishContentPageDocumentHetArchief,
	type UnpublishContentPageMutation as UnpublishContentPageMutationHetArchief,
	type UnpublishContentPageMutationVariables as UnpublishContentPageMutationVariablesHetArchief,
	UpdateContentBlockDocument as UpdateContentBlockDocumentHetArchief,
	type UpdateContentBlockMutation as UpdateContentBlockMutationHetArchief,
	type UpdateContentBlockMutationVariables as UpdateContentBlockMutationVariablesHetArchief,
	UpdateContentPageWithBlocksAndLabelsDocument as UpdateContentPageWithBlocksAndLabelsDocumentHetArchief,
	type UpdateContentPageWithBlocksAndLabelsMutation as UpdateContentPageWithBlocksAndLabelsMutationHetArchief,
	type UpdateContentPageWithBlocksAndLabelsMutationVariables as UpdateContentPageWithBlocksAndLabelsMutationVariablesHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';

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
	GetContentPagesQuery: GetContentPagesQueryAvo | GetContentPagesQueryHetArchief;
	GetContentTypesQueryAvo: GetContentTypesQueryAvo;
	GetContentTypesQueryHetArchief: GetContentTypesQueryHetArchief;
	GetContentTypesQuery: GetContentTypesQueryAvo | GetContentTypesQueryHetArchief;
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
	InsertContentMutation: InsertContentMutationAvo | InsertContentMutationHetArchief;
	InsertContentLabelLinksMutationAvo: InsertContentLabelLinksMutationAvo;
	InsertContentLabelLinksMutationHetArchief: InsertContentLabelLinksMutationHetArchief;
	InsertContentLabelLinksMutation:
		| InsertContentLabelLinksMutationAvo
		| InsertContentLabelLinksMutationHetArchief;
	SoftDeleteContentMutationAvo: SoftDeleteContentMutationAvo;
	SoftDeleteContentMutationHetArchief: SoftDeleteContentMutationHetArchief;
	SoftDeleteContentMutation: SoftDeleteContentMutationAvo | SoftDeleteContentMutationHetArchief;
	UpdateContentBlockMutationAvo: UpdateContentBlockMutationAvo;
	UpdateContentBlockMutationHetArchief: UpdateContentBlockMutationHetArchief;
	UpdateContentBlockMutation:
		| UpdateContentBlockMutationAvo
		| UpdateContentBlockMutationHetArchief;
	UpdateContentPageWithBlocksAndLabelsMutationAvo: UpdateContentPageWithBlocksAndLabelsMutationAvo;
	UpdateContentPageWithBlocksAndLabelsMutationHetArchief: UpdateContentPageWithBlocksAndLabelsMutationHetArchief;
	UpdateContentPageWithBlocksAndLabelsMutation:
		| UpdateContentPageWithBlocksAndLabelsMutationAvo
		| UpdateContentPageWithBlocksAndLabelsMutationHetArchief;
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
	UpdateContentPageWithBlocksAndLabelsMutationVariablesAvo: UpdateContentPageWithBlocksAndLabelsMutationVariablesAvo;
	UpdateContentPageWithBlocksAndLabelsMutationVariablesHetArchief: UpdateContentPageWithBlocksAndLabelsMutationVariablesHetArchief;
	UpdateContentPageWithBlocksAndLabelsMutationVariables:
		| UpdateContentPageWithBlocksAndLabelsMutationVariablesAvo
		| UpdateContentPageWithBlocksAndLabelsMutationVariablesHetArchief;
	GetContentByIdsQueryAvo: GetContentByIdsQueryAvo;
	GetContentByIdsQueryHetArchief: GetContentByIdsQueryHetArchief;
	GetContentByIdsQuery: GetContentByIdsQueryAvo | GetContentByIdsQueryHetArchief;
	GetContentPageByPathQueryAvo: GetContentPageByPathQueryAvo;
	GetContentPageByPathQueryHetArchief: GetContentPageByPathQueryHetArchief;
	GetContentPageByPathQuery: GetContentPageByPathQueryAvo | GetContentPageByPathQueryHetArchief;
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
	PublishContentPageMutationVariablesAvo: PublishContentPageMutationVariablesAvo;
	PublishContentPageMutationVariablesHetArchief: PublishContentPageMutationVariablesHetArchief;
	PublishContentPageMutationVariables:
		| PublishContentPageMutationVariablesAvo
		| PublishContentPageMutationVariablesHetArchief;
	UnpublishContentPageMutationVariablesAvo: UnpublishContentPageMutationVariablesAvo;
	UnpublishContentPageMutationVariablesHetArchief: UnpublishContentPageMutationVariablesHetArchief;
	UnpublishContentPageMutationVariables:
		| UnpublishContentPageMutationVariablesAvo
		| UnpublishContentPageMutationVariablesHetArchief;
	GetNlParentContentPagesQuery:
		| GetNlParentContentPagesQueryAvo
		| GetNlParentContentPagesQueryHetArchief;
	GetNlParentContentPagesQueryAvo: GetNlParentContentPagesQueryAvo;
	GetNlParentContentPagesQueryHetArchief: GetNlParentContentPagesQueryHetArchief;
	GetNlParentContentPagesQueryVariablesAvo: GetNlParentContentPagesQueryVariablesAvo;
	GetNlParentContentPagesQueryVariablesHetArchief: GetNlParentContentPagesQueryVariablesHetArchief;
	GetNlParentContentPagesQueryVariables:
		| GetNlParentContentPagesQueryVariablesAvo
		| GetNlParentContentPagesQueryVariablesHetArchief;
	GetNlParentContentPagesByTitleQuery:
		| GetNlParentContentPagesByTitleQueryAvo
		| GetNlParentContentPagesByTitleQueryHetArchief;
	GetNlParentContentPagesByTitleQueryAvo: GetNlParentContentPagesByTitleQueryAvo;
	GetNlParentContentPagesByTitleQueryHetArchief: GetNlParentContentPagesByTitleQueryHetArchief;
	GetNlParentContentPagesByTitleQueryVariablesAvo: GetNlParentContentPagesByTitleQueryVariablesAvo;
	GetNlParentContentPagesByTitleQueryVariablesHetArchief: GetNlParentContentPagesByTitleQueryVariablesHetArchief;
	GetNlParentContentPagesByTitleQueryVariables:
		| GetNlParentContentPagesByTitleQueryVariablesAvo
		| GetNlParentContentPagesByTitleQueryVariablesHetArchief;
	PublishContentPageMutationAvo: PublishContentPageMutationAvo;
	PublishContentPageMutationHetArchief: PublishContentPageMutationHetArchief;
	PublishContentPageMutation:
		| PublishContentPageMutationAvo
		| PublishContentPageMutationHetArchief;
	UnpublishContentPageMutationAvo: UnpublishContentPageMutationAvo;
	UnpublishContentPageMutationHetArchief: UnpublishContentPageMutationHetArchief;
	UnpublishContentPageMutation:
		| UnpublishContentPageMutationAvo
		| UnpublishContentPageMutationHetArchief;
	GetContentPagesToPublishQueryAvo: GetContentPagesToPublishQueryAvo;
	GetContentPagesToPublishQueryHetArchief: GetContentPagesToPublishQueryHetArchief;
	GetContentPagesToPublishQuery:
		| GetContentPagesToPublishQueryAvo
		| GetContentPagesToPublishQueryHetArchief;
	GetContentPagesToPublishQueryVariablesAvo: GetContentPagesToPublishQueryVariablesAvo;
	GetContentPagesToPublishQueryVariablesHetArchief: GetContentPagesToPublishQueryVariablesHetArchief;
	GetContentPagesToPublishQueryVariables:
		| GetContentPagesToPublishQueryVariablesAvo
		| GetContentPagesToPublishQueryVariablesHetArchief;
};

type ContentPageQueries = {
	DeleteContentBlockDocument: TypedDocumentNode<any, any>;
	DeleteContentLabelLinksDocument: TypedDocumentNode<any, any>;
	GetContentByIdDocument: TypedDocumentNode<any, any>;
	GetContentLabelsByContentTypeDocument: TypedDocumentNode<any, any>;
	GetContentPagesDocument: TypedDocumentNode<any, any>;
	GetContentTypesDocument: TypedDocumentNode<any, any>;
	GetPermissionsFromContentPageByPathDocument: TypedDocumentNode<any, any>;
	GetPublicContentPagesByTitleDocument: TypedDocumentNode<any, any>;
	GetPublicProjectContentPagesByTitleDocument: TypedDocumentNode<any, any>;
	GetPublicProjectContentPagesDocument: TypedDocumentNode<any, any>;
	InsertContentBlocksDocument: TypedDocumentNode<any, any>;
	InsertContentDocument: TypedDocumentNode<any, any>;
	InsertContentLabelLinksDocument: TypedDocumentNode<any, any>;
	SoftDeleteContentDocument: TypedDocumentNode<any, any>;
	UpdateContentBlockDocument: TypedDocumentNode<any, any>;
	UpdateContentPageWithBlocksAndLabelsDocument: TypedDocumentNode<any, any>;
	GetContentByIdsDocument: TypedDocumentNode<any, any>;
	GetContentPageByPathDocument: TypedDocumentNode<any, any>;
	GetContentPagesWithBlocksDocument: TypedDocumentNode<any, any>;
	GetPublicContentPagesDocument: TypedDocumentNode<any, any>;
	GetContentPagesToPublishDocument: TypedDocumentNode<any, any>;
	PublishContentPageDocument: TypedDocumentNode<any, any>;
	UnpublishContentPageDocument: TypedDocumentNode<any, any>;
	GetNlParentContentPagesDocument: TypedDocumentNode<any, any>;
	GetNlParentContentPagesByTitleDocument: TypedDocumentNode<any, any>;
};

export const CONTENT_PAGE_QUERIES: Record<DatabaseType, ContentPageQueries> = {
	[DatabaseType.avo]: {
		DeleteContentBlockDocument: DeleteContentBlockDocumentAvo,
		DeleteContentLabelLinksDocument: DeleteContentLabelLinksDocumentAvo,
		GetContentByIdDocument: GetContentByIdDocumentAvo,
		GetContentLabelsByContentTypeDocument: GetContentLabelsByContentTypeDocumentAvo,
		GetContentPagesDocument: GetContentPagesDocumentAvo,
		GetContentTypesDocument: GetContentTypesDocumentAvo,
		GetPermissionsFromContentPageByPathDocument: GetPermissionsFromContentPageByPathDocumentAvo,
		GetPublicContentPagesByTitleDocument: GetPublicContentPagesByTitleDocumentAvo,
		GetPublicProjectContentPagesByTitleDocument: GetPublicProjectContentPagesByTitleDocumentAvo,
		GetPublicProjectContentPagesDocument: GetPublicProjectContentPagesDocumentAvo,
		InsertContentBlocksDocument: InsertContentBlocksDocumentAvo,
		InsertContentDocument: InsertContentDocumentAvo,
		InsertContentLabelLinksDocument: InsertContentLabelLinksDocumentAvo,
		SoftDeleteContentDocument: SoftDeleteContentDocumentAvo,
		UpdateContentBlockDocument: UpdateContentBlockDocumentAvo,
		UpdateContentPageWithBlocksAndLabelsDocument:
			UpdateContentPageWithBlocksAndLabelsDocumentAvo,
		GetContentByIdsDocument: GetContentByIdsDocumentAvo,
		GetContentPageByPathDocument: GetContentPageByPathDocumentAvo,
		GetContentPagesWithBlocksDocument: GetContentPagesWithBlocksDocumentAvo,
		GetPublicContentPagesDocument: GetPublicContentPagesDocumentAvo,
		GetContentPagesToPublishDocument: GetContentPagesToPublishDocumentAvo,
		PublishContentPageDocument: PublishContentPageDocumentAvo,
		UnpublishContentPageDocument: UnpublishContentPageDocumentAvo,
		GetNlParentContentPagesDocument: GetNlParentContentPagesDocumentAvo,
		GetNlParentContentPagesByTitleDocument: GetNlParentContentPagesByTitleDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		DeleteContentBlockDocument: DeleteContentBlockDocumentHetArchief,
		DeleteContentLabelLinksDocument: DeleteContentLabelLinksDocumentHetArchief,
		GetContentByIdDocument: GetContentByIdDocumentHetArchief,
		GetContentLabelsByContentTypeDocument: GetContentLabelsByContentTypeDocumentHetArchief,
		GetContentPagesDocument: GetContentPagesDocumentHetArchief,
		GetContentTypesDocument: GetContentTypesDocumentHetArchief,
		GetPermissionsFromContentPageByPathDocument:
			GetPermissionsFromContentPageByPathDocumentHetArchief,
		GetPublicContentPagesByTitleDocument: GetPublicContentPagesByTitleDocumentHetArchief,
		GetPublicProjectContentPagesByTitleDocument:
			GetPublicProjectContentPagesByTitleDocumentHetArchief,
		GetPublicProjectContentPagesDocument: GetPublicProjectContentPagesDocumentHetArchief,
		InsertContentBlocksDocument: InsertContentBlocksDocumentHetArchief,
		InsertContentDocument: InsertContentDocumentHetArchief,
		InsertContentLabelLinksDocument: InsertContentLabelLinksDocumentHetArchief,
		SoftDeleteContentDocument: SoftDeleteContentDocumentHetArchief,
		UpdateContentBlockDocument: UpdateContentBlockDocumentHetArchief,
		UpdateContentPageWithBlocksAndLabelsDocument:
			UpdateContentPageWithBlocksAndLabelsDocumentHetArchief,
		GetContentByIdsDocument: GetContentByIdsDocumentHetArchief,
		GetContentPageByPathDocument: GetContentPageByPathDocumentHetArchief,
		GetContentPagesWithBlocksDocument: GetContentPagesWithBlocksDocumentHetArchief,
		GetPublicContentPagesDocument: GetPublicContentPagesDocumentHetArchief,
		GetContentPagesToPublishDocument: GetContentPagesToPublishDocumentHetArchief,
		PublishContentPageDocument: PublishContentPageDocumentHetArchief,
		UnpublishContentPageDocument: UnpublishContentPageDocumentHetArchief,
		GetNlParentContentPagesDocument: GetNlParentContentPagesDocumentHetArchief,
		GetNlParentContentPagesByTitleDocument: GetNlParentContentPagesByTitleDocumentHetArchief,
	},
};
