import { Button } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import React, { FunctionComponent, ReactNode } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { ContentPageInfo } from '~modules/collection/content-page/types/content-pages.types';
import { getProfileName } from '~modules/collection/shared/helpers/get-profile-info';
import { navigateToContentType } from '~modules/collection/shared/helpers/link';
import { normalizeTimestamp } from '~modules/shared/helpers/formatters/date';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

import { getPublishedDate } from '../../../helpers/get-published-state';

export interface ContentPageMetaProps {
	contentPageInfo: ContentPageInfo;
}

const ContentPageMeta: FunctionComponent<ContentPageMetaProps & RouteComponentProps> = ({
	contentPageInfo,
	history,
}) => {
	const { t } = useTranslation();

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
			{getProfileName(contentPageInfo.profile.user)}
		</span>
	);
};

export default withRouter(ContentPageMeta) as unknown as FunctionComponent<ContentPageMetaProps>;
