import { IconName } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import type { FC } from 'react';
import React from 'react';
import type { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router';
import { AdminConfigManager } from '~core/config';
import { ContentPageRenderer } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import { ErrorView } from '~shared/components/error';
import { tHtml } from '~shared/helpers/translation-functions';
import { useGetContentPageByPath } from '../hooks/get-content-page-by-path';

interface ContentPageWrapperProps {
	commonUser: Avo.User.CommonUser;
}

const ContentPageWrapper = ({
	match,
	commonUser,
}: ContentPageWrapperProps & RouteComponentProps<{ path: string }>) => {
	const {
		data: contentPageInfo,
		isLoading,
		isError,
	} = useGetContentPageByPath(AdminConfigManager.getConfig().locale, `/${match.params.path}`);

	if (isLoading) {
		return null;
	}
	if (isError) {
		return (
			<p>
				{tHtml(
					'modules/content-page/content-page-wrapper___het-laden-van-deze-pagina-inhoud-is-mislukt'
				)}
			</p>
		);
	}
	if (contentPageInfo) {
		return (
			<ContentPageRenderer
				contentPageInfo={contentPageInfo}
				commonUser={commonUser}
				renderNoAccessError={() => (
					<ErrorView
						icon={IconName.clock}
						actionButtons={['helpdesk']}
						message={'deze-pagina-is-enkel-voor-gebruikers-met-andere-rechten'}
					/>
				)}
			/>
		);
	}
};

export default withRouter(
	ContentPageWrapper as FC<ContentPageWrapperProps & RouteComponentProps<{ path: string }>>
) as unknown as FC<ContentPageWrapperProps>;
