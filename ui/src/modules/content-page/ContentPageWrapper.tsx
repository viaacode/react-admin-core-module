import React, { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import ContentPageRenderer from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import { useTranslation } from '~shared/hooks/useTranslation';
import { useGetContentPageByPath } from '../hooks/get-content-page-by-path';

const ContentPageWrapper: FC<RouteComponentProps<{ path: string }>> = (({ match }) => {
	const { tHtml } = useTranslation();
	const {
		data: contentPageInfo,
		isLoading,
		isError,
	} = useGetContentPageByPath('/' + match.params.path);

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
		return <ContentPageRenderer contentPageInfo={contentPageInfo} />;
	}
}) as FC<RouteComponentProps<{ path: string }>>;

export default withRouter(ContentPageWrapper as FC);
