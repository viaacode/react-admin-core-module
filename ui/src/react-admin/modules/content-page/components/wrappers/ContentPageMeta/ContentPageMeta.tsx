import { Button } from '@viaa/avo2-components';
import React, { FunctionComponent, ReactNode } from 'react';

import { getPublishedDate } from '../../../helpers/get-published-state';

import { ContentPageInfo, ContentPageLabel } from '~modules/content-page/types/content-pages.types';
import { normalizeTimestamp } from '~modules/shared/helpers/formatters/date';
import { navigateToContentType } from '~modules/shared/helpers/link';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { AdminConfigManager } from '~core/config';

export interface ContentPageMetaProps {
	contentPageInfo: ContentPageInfo;
}

const ContentPageMeta: FunctionComponent<ContentPageMetaProps> = ({ contentPageInfo }) => {
	const { tHtml } = useTranslation();
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const renderLabel = (labelObj: ContentPageLabel) => {
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
				{`${tHtml(
					'admin/content-block/components/wrappers/block-content-page-meta/block-content-page-meta___in'
				)} `}
				{contentPageInfo.labels.map((labelObj: ContentPageLabel, index: number) => {
					if (index === contentPageInfo.labels.length - 1) {
						return renderLabel(labelObj);
					}
					if (index === contentPageInfo.labels.length - 2) {
						return (
							<>
								{renderLabel(labelObj)}{' '}
								{tHtml(
									'admin/content-block/components/wrappers/block-content-page-meta/block-content-page-meta___en'
								)}{' '}
							</>
						);
					}
					return <>{renderLabel(labelObj)}, </>;
				})}{' '}
			</>
		);
	};

	const publishedDate = getPublishedDate(contentPageInfo);
	return (
		<span>
			{tHtml(
				'admin/content-block/components/wrappers/block-content-page-meta/block-content-page-meta___gepubliceerd-op'
			)}{' '}
			{publishedDate ? normalizeTimestamp(publishedDate).local().format('D MMMM YYYY') : '-'}{' '}
			{renderLabels()}
			{`${tHtml(
				'admin/content-block/components/wrappers/block-content-page-meta/block-content-page-meta___door'
			)}`}{' '}
			{contentPageInfo.owner?.fullName || '-'}
		</span>
	);
};

export default ContentPageMeta;
