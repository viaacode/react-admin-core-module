import { Button } from '@meemoo/react-components';
import {
	Button as AvoButton,
	Container,
	IconName,
	Toolbar,
	ToolbarRight,
} from '@viaa/avo2-components';
import { type AvoUserCommonUser, PermissionName } from '@viaa/avo2-types';
import clsx from 'clsx';
import { cloneDeep, compact, intersection, isNil, noop } from 'es-toolkit';
import { stringifyUrl } from 'query-string';
import React, { type FunctionComponent, type ReactNode } from 'react';
import type { BlockImageProps } from '~content-blocks/BlockImage/BlockImage';
import { AdminConfigManager } from '~core/config/config.class';
import { convertRichTextEditorStatesToHtml } from '~modules/content-page/services/content-page.converters';
import {
	type BlockClickHandler,
	BlockClickType,
	type ContentPageInfo,
} from '~modules/content-page/types/content-pages.types';
import { Icon } from '~shared/components/Icon/Icon';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { isAvo } from '~shared/helpers/is-avo';
import { buildLink } from '~shared/helpers/routing/link';
import { tText } from '~shared/helpers/translation-functions';
import { PermissionService } from '~shared/services/permission-service';
import { SpecialUserGroups } from '~shared/types/authentication.types';
import type { ContentBlockConfig } from '../../types/content-block.types';
import { ContentBlockType } from '../../types/content-block.types';
import ContentBlockRenderer from '.././ContentBlockRenderer/ContentBlockRenderer';

import './ContentPageRenderer.scss';
import { set } from 'es-toolkit/compat';
import {
	CONTENT_PAGE_PREVIEW_QUERY_PARAM,
	CONTENT_PAGE_USER_GROUP_ID_QUERY_PARAM,
} from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer.consts';
import { isAdminRoute } from '~shared/helpers/routing/is-admin-route';
import { isContentPagePreview } from '~shared/helpers/routing/is-content-page-preview';
import { isServerSideRendering } from '~shared/helpers/routing/is-server-side-rendering';

type ContentPageDetailProps = {
	contentPageInfo: Partial<ContentPageInfo>;
	activeBlockPosition?: number | null;
	onBlockClicked?: BlockClickHandler;
	commonUser?: AvoUserCommonUser;
	renderFakeTitle?: boolean;
	renderNoAccessError: () => ReactNode;
	userGroupId?: string | null;
};

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
		if (!isNil(props.userGroupId)) {
			currentUserGroupIds = [props.userGroupId];
		} else if (props.commonUser?.userGroup?.id) {
			currentUserGroupIds = [
				String(props.commonUser?.userGroup?.id),
				SpecialUserGroups.loggedInUsers,
			];
		} else {
			currentUserGroupIds = [SpecialUserGroups.loggedOutUsers];
		}

		contentBlockBlockConfigs = compact(
			contentBlockBlockConfigs.map(
				(contentBlockConfig: ContentBlockConfig): ContentBlockConfig | null => {
					if (currentUserGroupIds.includes(SpecialUserGroups.allContent)) {
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
		if (isServerSideRendering()) {
			return null;
		}
		const userCanEditPage = PermissionService.hasPerm(
			props.commonUser,
			PermissionName.EDIT_ANY_CONTENT_PAGES
		);

		if (isAdminRoute() || isContentPagePreview() || !userCanEditPage) {
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
									((props as any).onBlockClicked || noop)(
										contentBlockConfig.position,
										BlockClickType.PREVIEW
									)
								}
								commonUser={props.commonUser}
							/>
						);
					}
				)}
			</div>
		);
	};

	const renderPage = () => {
		if (!props.contentPageInfo) {
			return <CenteredSpinner locationId="content-page-renderer--loading" />;
		}
		if (isNil(props.contentPageInfo.contentType)) {
			return <div>Page with path {location.pathname} was not found</div>;
		}
		if (!isServerSideRendering()) {
			// bOnly execute this if not serverside rendering
			const queryParams = new URLSearchParams(window.location.search);
			if (queryParams.get(CONTENT_PAGE_PREVIEW_QUERY_PARAM) === 'true') {
				const userGroupId =
					queryParams.get(CONTENT_PAGE_USER_GROUP_ID_QUERY_PARAM)?.split(',')[0] ||
					String(props.commonUser?.userGroup?.id) ||
					SpecialUserGroups.loggedOutUsers;

				if (
					!props.contentPageInfo.userGroupIds?.includes(userGroupId) &&
					userGroupId !== SpecialUserGroups.allContent
				) {
					return props.renderNoAccessError();
				}
			}
		}

		return renderContentPage();
	};
	return renderPage();
};
