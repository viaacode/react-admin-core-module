import { IconName } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { cloneDeep, compact, intersection, noop, set } from 'lodash-es';
import React, { FunctionComponent } from 'react';
import { BlockImageProps } from '~content-blocks/BlockImage/BlockImage';
import { AdminConfigManager } from '~core/config';
import { convertRichTextEditorStatesToHtml } from '~modules/content-page/services/content-page.converters';
import {
	BlockClickHandler,
	ContentPageInfo,
} from '~modules/content-page/types/content-pages.types';
import { ErrorView } from '~shared/components/error';
import { isAvo } from '~shared/helpers/is-avo';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';
import { ContentBlockConfig, ContentBlockType } from '../../types/content-block.types';
import ContentBlockRenderer from '.././ContentBlockRenderer/ContentBlockRenderer';
import './ContentPageRenderer.scss';

type ContentPageDetailProps = {
	contentPageInfo: Partial<ContentPageInfo>;
	activeBlockPosition?: number | null;
	onBlockClicked?: BlockClickHandler;
	onLoaded?: (contentPageInfo: ContentPageInfo) => void;
	commonUser?: Avo.User.CommonUser;
};

const ContentPageRenderer: FunctionComponent<ContentPageDetailProps> = (props) => {
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
		if (contentPageInfo.contentType === 'FAQ_ITEM' && isAvo()) {
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
								className={clsx(
									`content-block-preview-${contentBlockConfig.position}`,
									{
										'c-content-block__active':
											contentBlockConfig.position ===
											(props as any).activeBlockPosition,
									}
								)}
								onClick={() =>
									((props as any).onBlockClicked || noop)(
										contentBlockConfig.position,
										'preview'
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

	const renderError = () => {
		return (
			<ErrorView
				icon={'alertTriangle' as IconName}
				message={AdminConfigManager.getConfig().services.i18n.tHtml(
					'content-page/views/content-page___het-laden-van-deze-content-pagina-is-mislukt'
				)}
			>
				<p>
					{AdminConfigManager.getConfig().services.i18n.tHtml(
						'content-page/views/content-page___het-laden-van-deze-content-pagina-is-mislukt'
					)}
				</p>
			</ErrorView>
		);
	};

	if (!props.contentPageInfo) {
		return renderError();
	}
	return renderContentPage();
};

export default ContentPageRenderer;
