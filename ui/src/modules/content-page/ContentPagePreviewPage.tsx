import { IconName } from '@viaa/avo2-components';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ContentPagePreviewUserRoleSelector } from '~modules/content-page/components/ContentPagePreviewUserRoleSelector/ContentPagePreviewUserRoleSelector';
import { ContentPageRenderer } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import type {
	ContentPageInfo,
	DbContentPage,
} from '~modules/content-page/types/content-pages.types';
import { ErrorView } from '~shared/components/error/ErrorView';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner.tsx';
import { Locale } from '../../../scripts/translation.types';
import { ContentPageService, convertDbContentPageToContentPageInfo } from '../../client';
import { getMockCommonUser } from '../../mock-common-user';

export const ContentPagePreviewPage: FC = () => {
	const [contentPageInfo, setContentPageInfo] = useState<ContentPageInfo | null>(null);
	const location = useLocation();

	const getContentPageByPath = useCallback(async () => {
		const contentPage: DbContentPage | null =
			await ContentPageService.getContentPageByLanguageAndPath(Locale.Nl, location.pathname);
		if (contentPage) {
			// Path is indeed a content page url
			setContentPageInfo(convertDbContentPageToContentPageInfo(contentPage));
		}
	}, [location.pathname]);

	useEffect(() => {
		getContentPageByPath().then();
	}, [getContentPageByPath]);

	if (!contentPageInfo) {
		return <CenteredSpinner locationId="content-page-preview-page--loading" />;
	}
	return (
		<>
			<ContentPagePreviewUserRoleSelector />
			<ContentPageRenderer
				contentPageInfo={contentPageInfo}
				commonUser={getMockCommonUser()}
				renderFakeTitle={contentPageInfo.contentType === 'FAQ_ITEM'}
				renderNoAccessError={() => (
					<ErrorView
						icon={IconName.clock}
						actionButtons={['helpdesk']}
						message={'deze-pagina-is-enkel-voor-gebruikers-met-andere-rechten'}
						locationId="content-page-preview__no-access-error"
					/>
				)}
			/>
		</>
	);
};
