import { Button } from '@viaa/avo2-components';
import { format } from 'date-fns';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { getPublishedDate } from '~modules/content-page/helpers/get-published-state';
import type {
	ContentPageInfo,
	ContentPageLabel,
} from '~modules/content-page/types/content-pages.types';
import { normalizeTimestamp } from '~shared/helpers/formatters/date';
import { navigateToContentType } from '~shared/helpers/routing/link';
import { tHtml } from '~shared/helpers/translation-functions';

export interface ContentPageMetaProps {
	contentPageInfo: ContentPageInfo;
}

export const BlockContentPageMeta: FunctionComponent<ContentPageMetaProps> = ({
	contentPageInfo,
}) => {
	const renderLabel = (labelObj: ContentPageLabel): string | ReactNode => {
		// biome-ignore lint/suspicious/noExplicitAny: todo
		return (labelObj as any).link_to ? (
			<Button
				type="inline-link"
				onClick={() =>
					// biome-ignore lint/suspicious/noExplicitAny: todo
					navigateToContentType((labelObj as any).link_to)
				}
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
