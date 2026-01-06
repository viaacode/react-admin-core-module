import { IconName } from '@viaa/avo2-components';
import { type AvoContentPagePage, AvoContentPageType } from '@viaa/avo2-types';
import React, { type FC } from 'react';
import { useLoaderData } from 'react-router';
import { ContentPagePreviewUserRoleSelector } from '~modules/content-page/components/ContentPagePreviewUserRoleSelector/ContentPagePreviewUserRoleSelector';
import { ContentPageRenderer } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { ErrorView } from '~shared/components/error/ErrorView';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner.tsx';

export const ContentPagePreviewPage: FC = () => {
	const contentPageInfoFromRoute = useLoaderData<{
		contentPage: AvoContentPagePage | null;
		url: string;
	}>();
	const contentPageInfo =
		contentPageInfoFromRoute?.contentPage as unknown as Partial<ContentPageInfo>;

	if (!contentPageInfo) {
		return <CenteredSpinner locationId="content-page-preview-page--loading" />;
	}
	return (
		<>
			<ContentPagePreviewUserRoleSelector url={contentPageInfoFromRoute.url} />
			<ContentPageRenderer
				contentPageInfo={contentPageInfo as unknown as Partial<ContentPageInfo>}
				renderFakeTitle={contentPageInfo.contentType === AvoContentPageType.FAQ_ITEM}
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
