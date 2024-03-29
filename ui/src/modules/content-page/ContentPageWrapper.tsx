import type { Avo } from '@viaa/avo2-types';
import React, { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import ContentPageRenderer from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import { useTranslation } from '~shared/hooks/useTranslation';
import { useGetContentPageByPath } from '../hooks/get-content-page-by-path';

interface ContentPageWrapperProps {
	commonUser: Avo.User.CommonUser;
}

const ContentPageWrapper = ({
	match,
	commonUser,
}: ContentPageWrapperProps & RouteComponentProps<{ path: string }>) => {
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
		return <ContentPageRenderer contentPageInfo={contentPageInfo} commonUser={commonUser} />;
	}
};

export default withRouter(
	ContentPageWrapper as FC<ContentPageWrapperProps & RouteComponentProps<{ path: string }>>
) as unknown as FC<ContentPageWrapperProps>;
