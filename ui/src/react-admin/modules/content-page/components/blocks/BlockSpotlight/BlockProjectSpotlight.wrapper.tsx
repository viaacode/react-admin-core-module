import { ButtonAction, RenderLinkFunction } from '@viaa/avo2-components';
import { get } from 'lodash-es';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { ContentPageService } from '../../../services/content-page.service';

import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~shared/helpers/custom-error';
import { useTranslation } from '~shared/hooks/useTranslation';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { BlockSpotlight, ImageInfo } from '~content-blocks/BlockSpotlight/BlockSpotlight';

interface ProjectSpotlightProps {
	project: ButtonAction;
	customImage: string;
	customTitle: string;
}

interface ProjectSpotlightWrapperProps {
	elements: ProjectSpotlightProps[];
	renderLink: RenderLinkFunction;
}

export const BlockProjectSpotlightWrapper: FunctionComponent<ProjectSpotlightWrapperProps> = ({
	elements,
	renderLink,
}) => {
	const { tHtml } = useTranslation();

	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [projectContentPages, setProjectContentPages] = useState<
		(ContentPageInfo | null)[] | null
	>(null);

	const fetchContentPages = useCallback(async () => {
		try {
			const promises = elements.map((projectInfo: ProjectSpotlightProps) => {
				const projectPath = get(projectInfo, 'project.value');
				if (projectPath && projectPath.toString && projectPath.toString()) {
					return ContentPageService.getContentPageByPath(
						projectInfo.project.value.toString()
					);
				}
				return Promise.resolve(null);
			});
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
	}, [elements, setProjectContentPages, setLoadingInfo, tHtml]);

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
						return {
							title:
								elements[index].customTitle ||
								get(projectContentPage, 'title') ||
								'',
							image:
								elements[index].customImage ||
								get(projectContentPage, 'thumbnail_path') ||
								'',
							buttonAction: elements[index].project,
						};
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