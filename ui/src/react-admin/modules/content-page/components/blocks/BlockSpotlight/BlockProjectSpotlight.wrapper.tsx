import { ButtonAction, RenderLinkFunction } from '@viaa/avo2-components';
import { type Avo } from '@viaa/avo2-types';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { BlockSpotlight, ImageInfo } from '~content-blocks/BlockSpotlight/BlockSpotlight';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { Locale } from '~modules/translations/translations.core.types';

import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~shared/helpers/custom-error';
import { tHtml, tText } from '~shared/helpers/translation-functions';

import { ContentPageService } from '../../../services/content-page.service';

interface ProjectSpotlightProps {
	project: ButtonAction;
	customImage: string;
	customTitle: string;
}

interface ProjectSpotlightWrapperProps {
	elements: ProjectSpotlightProps[];
	renderLink: RenderLinkFunction;
	commonUser?: Avo.User.CommonUser;
}

export const BlockProjectSpotlightWrapper: FunctionComponent<ProjectSpotlightWrapperProps> = ({
	elements,
	renderLink,
	commonUser,
}) => {
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [projectContentPages, setProjectContentPages] = useState<
		(ContentPageInfo | null)[] | null
	>(null);

	const fetchContentPages = useCallback(async () => {
		try {
			const promises = elements.map(
				async (projectInfo: ProjectSpotlightProps): Promise<ContentPageInfo | null> => {
					const projectPath = projectInfo?.project?.value;
					if (projectPath?.toString()) {
						try {
							return await ContentPageService.getContentPageByLanguageAndPath(
								(commonUser?.language || Locale.Nl) as Locale,
								projectPath.toString(),
								true
							);
						} catch (err) {
							// Failed to fetch one of the content pages
							// Continue rendering the block with one of the tiles missing
							return null;
						}
					}
					return null;
				}
			);
			setProjectContentPages(await Promise.all(promises));
		} catch (err) {
			console.error(new CustomError('Failed to get projects by path', err, { elements }));
			setLoadingInfo({
				state: 'error',
				message: tHtml(
					'admin/content-block/components/wrappers/project-spotlight-wrapper/project-spotlight-wrapper___het-ophalen-van-de-projecten-in-de-kijker-is-mislukt'
				),
				actionButtons: [],
			});
		}
	}, [elements, commonUser?.language]);

	useEffect(() => {
		fetchContentPages();
	}, [fetchContentPages]);

	useEffect(() => {
		if (projectContentPages) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [projectContentPages]);

	const renderBlockProjectSpotlight = () => {
		if (!projectContentPages) {
			return null;
		}
		return (
			<BlockSpotlight
				elements={projectContentPages.map(
					(projectContentPage: ContentPageInfo | null, index: number): ImageInfo => {
						const element = elements[index];
						if (projectContentPage) {
							return {
								title: element?.customTitle || projectContentPage?.title || '',
								image:
									element?.customImage || projectContentPage?.thumbnailPath || '',
								buttonAction: element?.project,
							};
						} else {
							return {
								title:
									tText(
										'react-admin/modules/content-page/components/blocks/block-spotlight/block-project-spotlight___pagina-niet-gevonden'
									) +
									': ' +
									element.project?.value?.toString(),
								image: '',
								buttonAction: undefined,
							};
						}
					}
				)}
				renderLink={renderLink}
			/>
		);
	};

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={projectContentPages}
			render={renderBlockProjectSpotlight}
			showSpinner={false}
		/>
	);
};
