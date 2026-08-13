import type { ContentPageLabelQueryTypes } from './queries/content-page-label.queries';

// The label rows come back as an avo | hetarchief union, and only hetarchief has a color column.
// Narrowing to the hetarchief row keeps the color access type checked, so removing color from the
// query is a compile error instead of a silently undefined value.
export type HetArchiefContentPageLabel =
	ContentPageLabelQueryTypes['GetContentPageLabelsQueryHetArchief']['app_content_label'][0];
export type HetArchiefContentPageLabelById =
	ContentPageLabelQueryTypes['GetContentPageLabelByIdQueryHetArchief']['app_content_label'][0];

export type ContentPageLabelOverviewTableCols =
	| 'label'
	| 'content_type'
	| 'link_to'
	| 'created_at'
	| 'updated_at'
	| 'actions';
