import { BlockImageProps } from '@viaa/avo2-components';
import clsx from 'clsx';
import { cloneDeep, compact, intersection, noop, set } from 'lodash-es';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { ContentPageService } from '../../services/content-page.service';
import { ContentBlockConfig, ContentBlockType } from '../../types/content-block.types';
import ContentBlockRenderer from '.././ContentBlockRenderer/ContentBlockRenderer';

import { AdminConfigManager } from '~core/config';
import {
	BlockClickHandler,
	ContentPageInfo,
} from '~modules/content-page/types/content-pages.types';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { AvoOrHetArchief } from '~modules/shared/types';
import { SpecialPermissionGroups } from '~modules/shared/types/authentication.types';

type ContentPageDetailProps =
	| {
			contentPageInfo: Partial<ContentPageInfo>;
			activeBlockPosition?: number | null;
			onBlockClicked?: BlockClickHandler;
			userGroupId: number | string | undefined;
	  }
	| {
			path: string;
			userGroupId: number | string | undefined;
	  };

const ContentPageRenderer: FunctionComponent<ContentPageDetailProps> = (props) => {
	const { tHtml } = useTranslation();
	const [contentPageInfo, setContentPageInfo] = useState<ContentPageInfo | null>(null);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });

	const fetchContentPage = useCallback(async () => {
		try {
			if ((props as any).path) {
				setContentPageInfo(
					await ContentPageService.getContentPageByPath((props as any).path)
				);
			} else if ((props as any).contentPageInfo) {
				setContentPageInfo((props as any).contentPageInfo);
			} else {
				console.error(
					new CustomError(
						'Failed to load content page because neither path not content page info was passed to ContentPage component',
						null,
						{ props }
					)
				);
				setLoadingInfo({
					state: 'error',
					message: tHtml(
						'content-page/views/content-page___het-laden-van-deze-content-pagina-is-mislukt'
					),
				});
			}
		} catch (err) {
			console.error(new CustomError('Failed to load content page', err, { props }));
			setLoadingInfo({
				state: 'error',
				message: tHtml(
					'content-page/views/content-page___het-laden-van-deze-content-pagina-is-mislukt'
				),
			});
		}
	}, [props, tHtml]);

	useEffect(() => {
		fetchContentPage();
	}, [fetchContentPage]);

	useEffect(() => {
		if (contentPageInfo) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPageInfo]);

	const getContentBlocks = (contentPageInfo: ContentPageInfo) => {
		// Convert editor states to html
		let contentBlockBlockConfigs = ContentPageService.convertRichTextEditorStatesToHtml(
			contentPageInfo.content_blocks || []
		);

		// images can have a setting to go full width
		// so we need to set the block prop: fullWidth to true if we find an image block with size setting: pageWidth
		contentBlockBlockConfigs = contentBlockBlockConfigs.map((contentBlockConfig) => {
			const width = (contentBlockConfig.components.state as BlockImageProps).width;
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
		if (
			contentPageInfo.contentType === 'FAQ_ITEM' &&
			AdminConfigManager.getConfig().database.databaseApplicationType === AvoOrHetArchief.avo
		) {
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
		if (props.userGroupId) {
			currentUserGroupIds = [
				String(props.userGroupId),
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
				{getContentBlocks(contentPageInfo as ContentPageInfo).map(
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
								contentPageInfo={contentPageInfo as ContentPageInfo}
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
							/>
						);
					}
				)}
			</div>
		);
	};

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={contentPageInfo}
			render={renderContentPage}
		/>
	);
};

export default ContentPageRenderer;
