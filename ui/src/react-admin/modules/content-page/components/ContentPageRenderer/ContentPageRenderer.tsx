import { Button } from '@meemoo/react-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
	Button as AvoButton,
	Container,
	IconName,
	Toolbar,
	ToolbarRight,
} from '@viaa/avo2-components';
import { type Avo, PermissionName } from '@viaa/avo2-types';
import clsx from 'clsx';
import { cloneDeep, compact, intersection, isNil, noop, set } from 'lodash-es';
import { stringifyUrl } from 'query-string';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import { StringParam, useQueryParams } from 'use-query-params';
import type { BlockImageProps } from '~content-blocks/BlockImage/BlockImage';
import { AdminConfigManager } from '~core/config';
import { convertRichTextEditorStatesToHtml } from '~modules/content-page/services/content-page.converters';
import type {
	BlockClickHandler,
	ContentPageInfo,
} from '~modules/content-page/types/content-pages.types';
import { Icon } from '~shared/components/Icon';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { ROUTE_PARTS } from '~shared/consts';
import { isAvo } from '~shared/helpers/is-avo';
import { buildLink } from '~shared/helpers/link';
import { tText } from '~shared/helpers/translation-functions';
import { PermissionService } from '~shared/services/permission-service';
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
	renderNoAccessError: () => ReactNode;
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
	const [queryParams] = useQueryParams({
		userGroupId: StringParam,
	});

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
		if (!isNil(queryParams?.userGroupId)) {
			currentUserGroupIds = [queryParams.userGroupId];
		} else if (props.commonUser?.userGroup?.id) {
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
					if (currentUserGroupIds.includes(SpecialPermissionGroups.allContent)) {
						return contentBlockConfig;
					}

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

	const renderEditButton = () => {
		const isAdminRoute = window.location.href.includes(ROUTE_PARTS.admin);
		const pageInPreview = window.location.href.includes('preview');
		const userCanEditPage = PermissionService.hasPerm(
			props.commonUser,
			PermissionName.EDIT_ANY_CONTENT_PAGES
		);

		if (isAdminRoute || pageInPreview || !userCanEditPage) {
			return <></>;
		}

		const renderHyperlink = (button: React.ReactNode) => {
			return (
				<a
					href={stringifyUrl({
						url: buildLink(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_EDIT'), {
							id: props.contentPageInfo.id,
						}),
					})}
					target="_blank"
					style={{ marginLeft: 'auto' }}
				>
					{button}
				</a>
			);
		};

		if (isAvo()) {
			return (
				<Container background="white">
					<Container mode="horizontal" className="u-d-flex">
						{renderHyperlink(
							<AvoButton
								type="link"
								icon={IconName.edit}
								title={tText(
									'modules/content-page/components/content-page-renderer/content-page-renderer___bewerk-pagina-tooltip'
								)}
								label={tText(
									'modules/content-page/components/content-page-renderer/content-page-renderer___bewerk-pagina'
								)}
							/>
						)}
					</Container>
				</Container>
			);
		}

		return (
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore: no-height is possible
			<Toolbar size="no-height">
				<ToolbarRight>
					{renderHyperlink(
						<Button
							iconStart={<Icon name="edit" />}
							title={tText(
								'modules/content-page/components/content-page-renderer/content-page-renderer___bewerk-pagina-tooltip'
							)}
							label={tText(
								'modules/content-page/components/content-page-renderer/content-page-renderer___bewerk-pagina'
							)}
							variants="text"
						/>
					)}
				</ToolbarRight>
			</Toolbar>
		);
	};

	const renderContentPage = () => {
		return (
			<div className="c-content-page-preview">
				<QueryClientProvider client={queryClient}>
					{renderEditButton()}
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

	const renderPage = () => {
		if (!props.contentPageInfo) {
			return <CenteredSpinner />;
		}
		if (isNil(props.contentPageInfo.contentType)) {
			return <div>Page with path {location.pathname} was not found</div>;
		}
		const queryParams = new URLSearchParams(window.location.search);
		if (queryParams.get('preview') === 'true') {
			const userGroupId = queryParams.get('userGroupId')?.split(',')[0] || '1'; // Default to meemoo admin

			if (
				!props.contentPageInfo.userGroupIds?.includes(userGroupId) &&
				userGroupId !== SpecialPermissionGroups.allContent
			) {
				return props.renderNoAccessError();
			}
		}
		return renderContentPage();
	};
	return renderPage();
};
