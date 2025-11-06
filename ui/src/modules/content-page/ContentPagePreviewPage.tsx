import { IconName } from '@viaa/avo2-components';
import React, { type FC, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ContentPagePreviewUserRoleSelector } from '~modules/content-page/components/ContentPagePreviewUserRoleSelector/ContentPagePreviewUserRoleSelector';
import { ContentPageRenderer } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer.js';
import type {
	ContentPageInfo,
	DbContentPage,
} from '~modules/content-page/types/content-pages.types.js';
import { ErrorView } from '~shared/components/error/ErrorView.js';
import { Locale } from '../../../scripts/translation.types.mjs';
import { ContentPageService, convertDbContentPageToContentPageInfo } from '../../client.js';
import { mockCommonUser } from '../../mock-common-user';

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
		return <div>Loading...</div>;
	}
	return (
		<>
			<ContentPagePreviewUserRoleSelector />
			<ContentPageRenderer
				contentPageInfo={contentPageInfo}
				commonUser={mockCommonUser}
				renderFakeTitle={contentPageInfo.contentType === 'FAQ_ITEM'}
				renderNoAccessError={() => (
					<ErrorView
						icon={IconName.clock}
						actionButtons={['helpdesk']}
						message={'deze-pagina-is-enkel-voor-gebruikers-met-andere-rechten'}
					/>
				)}
			/>
		</>
	);
};
