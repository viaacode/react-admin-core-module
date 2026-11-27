import { Button, ButtonToolbar, IconName, Table } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { AdminCoreIconName } from '~core/config/config.types';
import { Color, CustomBackground } from '~modules/content-page/types/content-block.types';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import { Locale } from '~modules/translations/translations.core.types';
import { GET_CONTENT_TYPE_LABELS } from '~shared/components/ContentPicker/ContentPicker.const';
import { Icon } from '~shared/components/Icon/Icon';
import type { LoadingInfo } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { LoadingErrorLoadedComponent } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { GET_LANGUAGE_NAMES } from '~shared/consts/language-names';
import { CustomError } from '~shared/helpers/custom-error';
import { isHetArchief } from '~shared/helpers/is-hetarchief';
import { isMultiLanguageEnabled } from '~shared/helpers/is-multi-language-enabled';
import { navigateFunc } from '~shared/helpers/navigate-fnc';
import {
	renderDateDetailRows,
	renderDetailRow,
	renderSimpleDetailRows,
} from '~shared/helpers/render-detail-fields';
import { buildLink, navigate, navigateToContentType } from '~shared/helpers/routing/link';
import { tText } from '~shared/helpers/translation-functions';
import { AdminLayout } from '~shared/layouts/AdminLayout/AdminLayout';
import { App } from '../../../../../scripts/translation.types';
import type { ContentPageLabel } from '../content-page-label.types';

import './ContentPageLabelDetail.scss';

type ContentPageLabelDetailProps = {
	contentPageLabelId: string;
	onGoBack: () => void;
} & DefaultComponentProps;

export const ContentPageLabelDetail: FunctionComponent<ContentPageLabelDetailProps> = ({
	contentPageLabelId,
	onGoBack,
	className,
}) => {
	// Hooks
	const [contentPageLabelInfo, setContentPageLabelInfo] = useState<ContentPageLabel | null>(null);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const { data: allLanguages } = useGetAllLanguages();
	const otherLanguages: Locale[] = (allLanguages || [])
		.map((languageInfo) => languageInfo.languageCode as Locale)
		.filter((languageCode) => languageCode !== Locale.Nl);

	const initOrFetchContentPageLabel = useCallback(async () => {
		try {
			const contentPageLabelObj =
				await ContentPageLabelService.fetchContentPageLabel(contentPageLabelId);

			if (!contentPageLabelObj) {
				setLoadingInfo({
					state: 'error',
					icon: IconName.search,
					message: tText(
						'admin/content-page-labels/views/content-page-label-detail___deze-content-pagina-label-werd-niet-gevonden'
					),
				});
				return;
			}

			const contentLabel = {
				id: contentPageLabelObj.id,
				label: contentPageLabelObj.label,
				content_type: contentPageLabelObj.content_type,
				language: contentPageLabelObj.language,
				link_to: contentPageLabelObj.link_to,
				color: contentPageLabelObj.color,
				nl_parent_label_id: contentPageLabelObj.nl_parent_label_id,
				nl_parent_label: contentPageLabelObj.nl_parent_label,
				translated_labels: contentPageLabelObj.translated_labels,
				created_at: contentPageLabelObj.created_at,
				updated_at: contentPageLabelObj.updated_at,
			};
			setContentPageLabelInfo(contentLabel);
		} catch (err) {
			console.error(
				new CustomError('Failed to get content page label by id', err, {
					query: 'GET_CONTENT_PAGE_LABEL_BY_ID',
					variables: { id: contentPageLabelId },
				})
			);
			setLoadingInfo({
				state: 'error',
				message: tText(
					'admin/content-page-labels/views/content-page-label-detail___het-ophalen-van-de-content-pagina-label-is-mislukt'
				),
			});
		}
	}, [contentPageLabelId]);

	useEffect(() => {
		initOrFetchContentPageLabel();
	}, [initOrFetchContentPageLabel]);

	useEffect(() => {
		if (contentPageLabelInfo) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPageLabelInfo]);

	const handleEditClick = async () => {
		await navigateFunc(
			buildLink(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_EDIT'), {
				id: contentPageLabelId,
			})
		);
	};

	const renderLabelLink = (
		label: Pick<ContentPageLabel, 'id' | 'label' | 'language'> | null | undefined
	) => {
		if (!label) {
			return '-';
		}
		return (
			<Button
				type="tertiary"
				onClick={() =>
					navigate(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_DETAIL'), {
						id: String(label.id),
					})
				}
				label={label.label}
			/>
		);
	};

	/**
	 * Rows with the links between labels in different languages (ARC-4200)
	 * A dutch label shows its translation per other language, a translated label shows its dutch version
	 */
	const renderTranslationRows = (contentPageLabel: ContentPageLabel) => {
		if (!isMultiLanguageEnabled()) {
			return null;
		}

		if (contentPageLabel.language !== Locale.Nl) {
			return renderDetailRow(
				renderLabelLink(contentPageLabel.nl_parent_label),
				tText(
					'modules/content-page-labels/views/content-page-label-detail___nederlandse-versie',
					{},
					[App.HET_ARCHIEF]
				)
			);
		}

		return otherLanguages.map((language) => {
			const translatedLabel = (contentPageLabel.translated_labels || []).find(
				(label) => label.language === language
			);
			const rowLabel =
				language === Locale.En
					? tText(
							'modules/content-page-labels/views/content-page-label-detail___engelse-versie',
							{},
							[App.HET_ARCHIEF]
						)
					: GET_LANGUAGE_NAMES()[language] || String(language).toUpperCase();
			return (
				<Fragment key={`translated-label-${language}`}>
					{renderDetailRow(renderLabelLink(translatedLabel), rowLabel)}
				</Fragment>
			);
		});
	};

	const renderDetailPage = () => {
		if (!contentPageLabelInfo) {
			return;
		}

		const linkTo = contentPageLabelInfo.link_to;
		const labels = GET_CONTENT_TYPE_LABELS();
		// The meemoo logo is a pattern the client fills in, not a css value, so the swatch shows it the
		// same way the label chip does: transparent. Same for a label without a colour, which only the
		// type allows, because avo shares this dto and has no colour column
		const swatchBackground =
			!contentPageLabelInfo.color || contentPageLabelInfo.color === CustomBackground.MeemooLogo
				? Color.Transparent
				: contentPageLabelInfo.color;

		return (
			<Table horizontal variant="invisible" className="c-table_detail-page">
				<tbody>
					{renderSimpleDetailRows(contentPageLabelInfo, [
						['label', tText('admin/content-page-labels/views/content-page-label-detail___label')],
						[
							'content_type',
							tText('admin/content-page-labels/views/content-page-label-detail___type'),
						],
					])}
					{renderDetailRow(
						contentPageLabelInfo.language,
						tText('modules/content-page-labels/views/content-page-label-detail___taal'),
						isMultiLanguageEnabled()
					)}
					{renderDetailRow(
						linkTo ? (
							<Button
								type="tertiary"
								onClick={() => navigateToContentType(linkTo)}
							>{`${labels[linkTo.type]} - ${decodeURIComponent(
								String(linkTo.value)?.split('hetarchief.be')?.pop() || ''
							)}`}</Button>
						) : (
							'-'
						),
						tText('admin/content-page-labels/views/content-page-label-detail___link')
					)}
					{renderDetailRow(
						<div
							className="c-content-page-label-detail__color-swatch"
							// Not backgroundColor: one of the options is a gradient
							style={{ background: swatchBackground }}
						/>,
						tText(
							'modules/content-page-labels/views/content-page-label-detail___achtergrondkleur',
							{},
							[App.HET_ARCHIEF]
						),
						isHetArchief()
					)}
					{renderTranslationRows(contentPageLabelInfo)}
					{renderDateDetailRows(contentPageLabelInfo, [
						[
							'created_at',
							tText('admin/content-page-labels/views/content-page-label-detail___aangemaakt-op'),
						],
						[
							'updated_at',
							tText('admin/content-page-labels/views/content-page-label-detail___aangepast-op'),
						],
					])}
				</tbody>
			</Table>
		);
	};

	// Render
	const renderPage = () => {
		if (!contentPageLabelInfo) {
			return null;
		}
		return (
			<AdminLayout
				pageTitle={tText(
					'admin/content-page-labels/views/content-page-label-detail___content-pagina-label-details'
				)}
				className={className}
			>
				<AdminLayout.Back>
					<Button type="borderless" onClick={onGoBack}>
						<Icon name={AdminCoreIconName.ChevronLeft} />
					</Button>
				</AdminLayout.Back>
				<AdminLayout.Actions>
					<ButtonToolbar>
						<Button
							label={tText('admin/content-page-labels/views/content-page-label-detail___bewerken')}
							title={tText(
								'admin/content-page-labels/views/content-page-label-detail___bewerk-deze-content-pagina-label'
							)}
							ariaLabel={tText(
								'admin/content-page-labels/views/content-page-label-detail___bewerk-deze-content-pagina-label'
							)}
							onClick={handleEditClick}
							type="primary"
						/>
					</ButtonToolbar>
				</AdminLayout.Actions>
				<AdminLayout.Content>{renderDetailPage()}</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={contentPageLabelInfo}
			render={renderPage}
			locationId="content-page-label-detail"
		/>
	);
};
