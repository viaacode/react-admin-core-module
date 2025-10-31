import { IconName } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import type { FC } from 'react';
import React from 'react';
import {useMatch} from 'react-router';
import {AdminConfigManager} from '~core/config';
import {getCommonUser} from '~core/config/config.selectors';
import {ContentPageRenderer} from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import {tHtml} from '~shared/helpers/translation-functions';
import {useGetContentPageByPath} from '../hooks/get-content-page-by-path';

export const ContentPageWrapper = () => {
	const match = useMatch<'path', string>('/:path');
	const contentPagePath = `/${match?.params.path || ''}`;

	const commonUser = getCommonUser();

	const {
		data: contentPageInfo,
		isLoading,
		isError,
	} = useGetContentPageByPath(AdminConfigManager.getConfig().locale, contentPagePath);

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
                contentPageInfo={contentPageInfo} commonUser={commonUser || undefined} 
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
