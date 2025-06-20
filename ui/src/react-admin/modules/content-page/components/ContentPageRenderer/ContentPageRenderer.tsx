import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { cloneDeep, compact, intersection, noop, set } from 'lodash-es';
import type { FunctionComponent } from 'react';
import React from 'react';
import type { BlockImageProps } from '~content-blocks/BlockImage/BlockImage';
import { convertRichTextEditorStatesToHtml } from '~modules/content-page/services/content-page.converters';
import type {
	BlockClickHandler,
	ContentPageInfo,
} from '~modules/content-page/types/content-pages.types';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';
import type { ContentBlockConfig } from '../../types/content-block.types';
import { ContentBlockType } from '../../types/content-block.types';
import ContentBlockRenderer from '.././ContentBlockRenderer/ContentBlockRenderer';
import './ContentPageRenderer.scss';

type ContentPageDetailProps = {
	contentPageInfo: Partial<ContentPageInfo>;
	activeBlockPosition?: number | null;
	onBlockClicked?: BlockClickHandler;
	commonUser?: Avo.User.CommonUser;
	renderFakeTitle?: boolean;
};

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			keepPreviousData: true,
			retry: 0,
		},
	},
});

export const ContentPageRenderer: FunctionComponent<ContentPageDetailProps> = (props) => {
	const getContentBlocks = (contentPageInfo: ContentPageInfo) => {
		// Convert editor states to html
		let contentBlockBlockConfigs = convertRichTextEditorStatesToHtml(
			contentPageInfo.content_blocks || []
		);

		// images can have a setting to go full width
		// So we need to set the block prop: fullWidth to true if we find an image block with size setting: pageWidth
		contentBlockBlockConfigs = contentBlockBlockConfigs.map((contentBlockConfig) => {
			const width = (contentBlockConfig.components.state as BlockImageProps)?.width;
			if (
				contentBlockConfig.type === ContentBlockType.Image &&
				width &&
				!width.endsWith('%') &&
				!width.endsWith('px')
			) {
				return set(cloneDeep(contentBlockConfig), 'block.state.fullWidth', true);
			}
			return contentBlockConfig;
		});

		// Add page title as header block for faq items. Only for Avo
		if (props.renderFakeTitle) {
			contentBlockBlockConfigs = [
				{
					position: 0,
					name: 'Titel',
					type: 'HEADING',
					components: {
						state: {
							children: contentPageInfo.title,
							type: 'h1',
							align: 'left',
						},
					},
					block: {
						state: {
							blockType: 'HEADING',
							position: 2,
							backgroundColor: '#FFF',
							headerBackgroundColor: '#FFF',
							padding: {
								top: 'top-extra-large',
								bottom: 'bottom-small',
							},
						},
					},
				} as unknown as ContentBlockConfig,
				...contentBlockBlockConfigs,
			];
		}

		// Only accept content blocks for which the user is authorized
		let currentUserGroupIds: string[];
		if (props.commonUser?.userGroup?.id) {
			currentUserGroupIds = [
				String(props.commonUser?.userGroup?.id),
				SpecialPermissionGroups.loggedInUsers,
			];
		} else {
			currentUserGroupIds = [SpecialPermissionGroups.loggedOutUsers];
		}

		contentBlockBlockConfigs = compact(
			contentBlockBlockConfigs.map(
				(contentBlockConfig: ContentBlockConfig): ContentBlockConfig | null => {
					const blockUserGroupIds: (string | number)[] = (
						contentBlockConfig.block.state.userGroupIds || []
					).map(String);

					if (blockUserGroupIds.length) {
						// Block has special restrictions set
						if (intersection(blockUserGroupIds, currentUserGroupIds).length === 0) {
							// The user doesn't have the right permissions to see this block
							return null;
						}
					}

					// The user has the right permissions or there are no permissions defined for this block
					return contentBlockConfig;
				}
			)
		);

		return contentBlockBlockConfigs;
	};

	const renderContentPage = () => {
		// TODO render <InteractiveTour showButton={false} /> manually in AVO above the content page
		return (
			<div className="c-content-page-preview">
				<QueryClientProvider client={queryClient}>
					{getContentBlocks(props.contentPageInfo as ContentPageInfo).map(
						(contentBlockConfig: ContentBlockConfig) => {
							return (
								<ContentBlockRenderer
									key={
										'content-block-preview-' +
										contentBlockConfig.type +
										'-' +
										contentBlockConfig.position
									}
									contentBlockConfig={contentBlockConfig}
									contentPageInfo={props.contentPageInfo as ContentPageInfo}
									className={clsx(`content-block-preview-${contentBlockConfig.position}`, {
										'c-content-block__active':
											contentBlockConfig.position ===
											// biome-ignore lint/suspicious/noExplicitAny: todo
											(props as any).activeBlockPosition,
									})}
									onClick={() =>
										// biome-ignore lint/suspicious/noExplicitAny: todo
										((props as any).onBlockClicked || noop)(contentBlockConfig.position, 'preview')
									}
									commonUser={props.commonUser}
								/>
							);
						}
					)}
				</QueryClientProvider>
			</div>
		);
	};

	if (!props.contentPageInfo) {
		return <CenteredSpinner />;
	}
	return renderContentPage();
};
