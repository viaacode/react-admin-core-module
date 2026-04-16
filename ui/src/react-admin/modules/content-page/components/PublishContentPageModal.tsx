import type { IconName } from '@viaa/avo2-components';
import {
	Button,
	ButtonToolbar,
	DatePicker,
	Form,
	FormGroup,
	Icon,
	Modal,
	ModalBody,
	RadioButtonGroup,
	Spacer,
	Toolbar,
	ToolbarItem,
	ToolbarRight,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@viaa/avo2-components';
import { parseISO, setHours, setMinutes, setSeconds } from 'date-fns';
import type { FC } from 'react';
import React, { useState } from 'react';
import { BlockHeading } from '~content-blocks/BlockHeading/BlockHeading';
import { ToastType } from '~core/config/config.types';
import { getDatePickerDefaultProps } from '~modules/content-page/components/DatePicker/DatePicker.consts';
import { getPublishedState } from '~modules/content-page/helpers/get-published-state';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import type { ContentPageInfo, PublishOption } from '../types/content-pages.types';

import './PublishContentPageModal.scss';

interface PublishContentPageModalProps {
	isOpen: boolean;
	onClose: (contentPage?: ContentPageInfo) => void;
	contentPage: ContentPageInfo;
}

const PublishContentPageModal: FC<PublishContentPageModalProps> = ({
	onClose,
	isOpen,
	contentPage,
}) => {
	const [validationError, setValidationError] = useState<string[] | undefined>(undefined);
	const [selectedOption, setSelectedOption] = useState<PublishOption>(
		getPublishedState(contentPage)
	);
	const [publishedAtDisplay, setPublishedAtDisplay] = useState<string | null>(
		contentPage.publishedAtDisplay || contentPage.publishedAt
	);
	const [publishAt, setPublishAt] = useState<string | null>(contentPage.publishAt);
	const [depublishAt, setDepublishAt] = useState<string | null>(contentPage.depublishAt);

	const onSave = async () => {
		try {
			const now = new Date();
			let isPublic = false;
			if (selectedOption === 'public') {
				isPublic = true;
			} else if (selectedOption === 'timebound') {
				if (publishAt) {
					if (new Date(publishAt) < now) {
						// publishAt is in the past
						if ((depublishAt && new Date(depublishAt) > now) || !depublishAt) {
							isPublic = true;
						}
					} // else: publishAt is in the future => isPublic = false
				} else {
					// publishAt is empty
					if ((depublishAt && new Date(depublishAt) > now) || !depublishAt) {
						isPublic = true;
					} // else: depublishAt is in the past => isPublic = false
				}
			}
			const newContent: ContentPageInfo = {
				isPublic,
				publishedAt: isPublic ? publishedAtDisplay || now.toISOString() : null,
				publishedAtDisplay: publishedAtDisplay || null,
				depublishedAt: isPublic ? null : contentPage.depublishedAt || now.toISOString(),
				publishAt: selectedOption === 'timebound' ? publishAt : null,
				depublishAt: selectedOption === 'timebound' ? depublishAt : null,
			} as ContentPageInfo;
			setValidationError(undefined);
			closeModal(newContent);
		} catch (_err) {
			showToast({
				title: tText('modules/admin/content-page/components/publish-content-page-modal___error'),
				description: tText(
					'admin/content/components/share-content-page-modal___de-aanpassingen-kunnen-niet-worden-opgeslagen'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const resetModal = () => {
		setSelectedOption(getPublishedState(contentPage));
		setPublishAt(contentPage.publishAt);
		setDepublishAt(contentPage.depublishAt);
	};

	const closeModal = (newContent?: ContentPageInfo) => {
		if (!newContent) {
			resetModal();
		} else {
			setValidationError(undefined);
		}
		onClose(newContent);
	};

	const getPublishedAtDisplayDate = (): Date | undefined => {
		if (publishedAtDisplay) {
			return parseISO(publishedAtDisplay);
		} else if (contentPage.publishedAt) {
			return parseISO(contentPage.publishedAt);
		} else {
			return undefined;
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			title={tText(
				'admin/content/components/share-content-page-modal___maak-deze-content-pagina-publiek'
			)}
			size="large"
			onClose={closeModal}
			scrollable={false}
			className="p-content-page-publish-modal"
		>
			<ModalBody>
				<p>
					{tHtml(
						'admin/content/components/share-content-page-modal___bepaald-in-hoevere-je-pagina-zichtbaar-is-voor-andere-gebruikers'
					)}
				</p>
				<FormGroup error={validationError}>
					<Spacer margin="top-large">
						<BlockHeading className="u-m-0" type="h4">
							{tHtml('admin/content/components/share-content-page-modal___zichtbaarheid')}
						</BlockHeading>
					</Spacer>
					<RadioButtonGroup
						options={[
							{
								label: tText('admin/content/components/share-content-page-modal___prive'),
								value: 'private',
							},
							{
								label: tText('admin/content/components/share-content-page-modal___openbaar'),
								value: 'public',
							},
							{
								label: tText('admin/content/components/share-content-page-modal___tijdsgebonden'),
								value: 'timebound',
							},
						]}
						value={selectedOption}
						onChange={setSelectedOption as (value: string) => void}
					/>
				</FormGroup>
				<Spacer margin="left-large">
					<Form>
						<FormGroup
							label={tText('admin/content/components/share-content-page-modal___publiceren-op')}
						>
							<DatePicker
								{...getDatePickerDefaultProps('publish-content-page-modal__publish-at')}
								value={publishAt ? parseISO(publishAt) : undefined}
								onChange={(date) => setPublishAt(date ? date.toISOString() : null)}
								showTimeInput={false}
								disabled={selectedOption !== 'timebound'}
							/>
						</FormGroup>
						<FormGroup
							label={tText('admin/content/components/share-content-page-modal___depubliceren-op')}
						>
							<DatePicker
								{...getDatePickerDefaultProps('publish-content-page-modal__depublish-at')}
								value={depublishAt ? parseISO(depublishAt) : undefined}
								onChange={(date) => setDepublishAt(date ? date.toISOString() : null)}
								showTimeInput={false}
								disabled={selectedOption !== 'timebound'}
							/>
						</FormGroup>
					</Form>
				</Spacer>

				<FormGroup
					label={tText(
						'admin/content/components/publish-content-page-modal___display-datum-optioneel'
					)}
					className="c-content-page-publish-modal__display-date"
				>
					<Spacer margin={['left-large', 'top']}>
						<DatePicker
							{...getDatePickerDefaultProps('publish-content-page-modal__published-at-display')}
							value={getPublishedAtDisplayDate()}
							onChange={(date) =>
								setPublishedAtDisplay(
									date ? setSeconds(setMinutes(setHours(date, 7), 0), 0).toISOString() : null
								)
							}
						/>
						<Tooltip position="right">
							<TooltipTrigger>
								<Icon className="a-info-icon" name={'info' as IconName} size="small" />
							</TooltipTrigger>
							<TooltipContent>
								{tHtml(
									'admin/content/components/publish-content-page-modal___tooltip-display-date'
								)}
							</TooltipContent>
						</Tooltip>
					</Spacer>
				</FormGroup>

				<Toolbar spaced>
					<ToolbarRight>
						<ToolbarItem>
							<ButtonToolbar>
								<Button
									type="secondary"
									label={tText('admin/content/components/share-content-page-modal___annuleren')}
									onClick={() => closeModal()}
								/>
								<Button
									type="primary"
									label={tText('admin/content/components/share-content-page-modal___opslaan')}
									onClick={onSave}
								/>
							</ButtonToolbar>
						</ToolbarItem>
					</ToolbarRight>
				</Toolbar>
			</ModalBody>
		</Modal>
	);
};

export default PublishContentPageModal;
