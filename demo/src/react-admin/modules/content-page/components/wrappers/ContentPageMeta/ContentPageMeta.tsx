import { Button } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import React, { FunctionComponent, ReactNode } from 'react';

import { getPublishedDate } from '../../../helpers/get-published-state';

import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { normalizeTimestamp } from '~modules/shared/helpers/formatters/date';
import { getProfileName } from '~modules/shared/helpers/get-profile-info';
import { navigateToContentType } from '~modules/shared/helpers/link';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { AdminConfigManager } from '~core/config';

export interface ContentPageMetaProps {
	contentPageInfo: ContentPageInfo;
}

const ContentPageMeta: FunctionComponent<ContentPageMetaProps> = ({ contentPageInfo }) => {
	const { t } = useTranslation();
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const renderLabel = (labelObj: Partial<Avo.ContentPage.Label>) => {
		return (labelObj as any).link_to ? (
			<Button
				type="inline-link"
				onClick={() => navigateToContentType((labelObj as any).link_to, history)}
				key={`label-link-${labelObj.label}`}
			>
				{labelObj.label}
			</Button>
		) : (
			labelObj.label
		);
	};

	const renderLabels = (): ReactNode => {
		if (!contentPageInfo.labels || !contentPageInfo.labels.length) {
			return null;
		}

		return (
			<>
				{`${t(
					'admin/content-block/components/wrappers/block-content-page-meta/block-content-page-meta___in'
				)} `}
				{contentPageInfo.labels.map(
					(labelObj: Partial<Avo.ContentPage.Label>, index: number) => {
						if (index === contentPageInfo.labels.length - 1) {
							return renderLabel(labelObj);
						}
						if (index === contentPageInfo.labels.length - 2) {
							return (
								<>
									{renderLabel(labelObj)}{' '}
									{t(
										'admin/content-block/components/wrappers/block-content-page-meta/block-content-page-meta___en'
									)}{' '}
								</>
							);
						}
						return <>{renderLabel(labelObj)}, </>;
					}
				)}{' '}
			</>
		);
	};

	const publishedDate = getPublishedDate(contentPageInfo);
	return (
		<span>
			{t(
				'admin/content-block/components/wrappers/block-content-page-meta/block-content-page-meta___gepubliceerd-op'
			)}{' '}
			{publishedDate ? normalizeTimestamp(publishedDate).local().format('D MMMM YYYY') : '-'}{' '}
			{renderLabels()}
			{`${t(
				'admin/content-block/components/wrappers/block-content-page-meta/block-content-page-meta___door'
			)}`}{' '}
			{getProfileName(contentPageInfo.profile)}
		</span>
	);
};

export default ContentPageMeta;
