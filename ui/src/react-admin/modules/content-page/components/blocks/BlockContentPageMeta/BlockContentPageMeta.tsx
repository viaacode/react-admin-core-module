import { Button } from '@viaa/avo2-components';
import { format } from 'date-fns';
import React, { FunctionComponent, ReactNode } from 'react';
import { getPublishedDate } from '~modules/content-page/helpers';

import { ContentPageInfo, ContentPageLabel } from '~modules/content-page/types/content-pages.types';
import { normalizeTimestamp } from '~shared/helpers/formatters/date';
import { navigateToContentType } from '~shared/helpers/link';
import { tHtml } from '~shared/helpers/translation-functions';
import { AdminConfigManager } from '~core/config';

export interface ContentPageMetaProps {
	contentPageInfo: ContentPageInfo;
}

export const BlockContentPageMeta: FunctionComponent<ContentPageMetaProps> = ({
	contentPageInfo,
}) => {
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const renderLabel = (labelObj: ContentPageLabel): string | ReactNode => {
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
				{tHtml(
					'admin/content-block/components/wrappers/block-content-page-meta/block-content-page-meta___in'
				)}{' '}
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
			{publishedDate ? format(normalizeTimestamp(publishedDate), 'd MMMM yyyy') : '-'}{' '}
			{renderLabels()}
			{tHtml(
				'admin/content-block/components/wrappers/block-content-page-meta/block-content-page-meta___door'
			)}{' '}
			{contentPageInfo.owner?.fullName || '-'}
		</span>
	);
};
