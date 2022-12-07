import {
	BlockHeading,
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
import React, { FunctionComponent, useState } from 'react';

import { getPublishedState } from '../helpers/get-published-state';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

import './PublishContentPageModal.scss';
import { ContentPageInfo, PublishOption } from '../types/content-pages.types';

interface PublishContentPageModalProps {
	isOpen: boolean;
	onClose: (contentPage?: Partial<ContentPageInfo>) => void;
	contentPage: ContentPageInfo;
}

const PublishContentPageModal: FunctionComponent<PublishContentPageModalProps> = ({
	onClose,
	isOpen,
	contentPage,
}) => {
	const { tHtml, tText } = useTranslation();

	const [validationError, setValidationError] = useState<string[] | undefined>(undefined);
	const [selectedOption, setSelectedOption] = useState<PublishOption>(
		getPublishedState(contentPage)
	);
	const [publishedAt, setPublishedAt] = useState<string | null>(contentPage.publishedAt);
	const [publishAt, setPublishAt] = useState<string | null>(contentPage.publishAt);
	const [depublishAt, setDepublishAt] = useState<string | null>(contentPage.depublishAt);

	const onSave = async () => {
		try {
			const now = new Date();
			const newContent: Partial<ContentPageInfo> = {
				is_public:
					selectedOption === 'public' ||
					(selectedOption === 'timebound' &&
						((publishAt &&
							new Date(publishAt) < now &&
							((depublishAt && new Date(depublishAt) > now) || !depublishAt)) ||
							(!publishAt &&
								(!depublishAt || (depublishAt && new Date(depublishAt) > now))))),
				published_at:
					publishedAt || (selectedOption === 'public' ? now.toISOString() : null),
				publish_at: selectedOption === 'timebound' ? publishAt : null,
				depublish_at: selectedOption === 'timebound' ? depublishAt : null,
			} as Partial<ContentPageInfo>;
			setValidationError(undefined);
			closeModal(newContent);
		} catch (err) {
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText(
					'modules/admin/content-page/components/publish-content-page-modal___error'
				),
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

	const closeModal = (newContent?: Partial<ContentPageInfo>) => {
		if (!newContent) {
			resetModal();
		} else {
			setValidationError(undefined);
		}
		onClose(newContent);
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
							{tHtml(
								'admin/content/components/share-content-page-modal___zichtbaarheid'
							)}
						</BlockHeading>
					</Spacer>
					<RadioButtonGroup
						options={[
							{
								label: tText(
									'admin/content/components/share-content-page-modal___prive'
								),
								value: 'private',
							},
							{
								label: tText(
									'admin/content/components/share-content-page-modal___openbaar'
								),
								value: 'public',
							},
							{
								label: tText(
									'admin/content/components/share-content-page-modal___tijdsgebonden'
								),
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
							label={tText(
								'admin/content/components/share-content-page-modal___publiceren-op'
							)}
						>
							<DatePicker
								value={publishAt ? new Date(publishAt) : null}
								onChange={(date) => setPublishAt(date ? date.toISOString() : null)}
								showTimeInput={true}
								disabled={selectedOption !== 'timebound'}
							/>
						</FormGroup>
						<FormGroup
							label={tText(
								'admin/content/components/share-content-page-modal___depubliceren-op'
							)}
						>
							<DatePicker
								value={depublishAt ? new Date(depublishAt) : null}
								onChange={(date) =>
									setDepublishAt(date ? date.toISOString() : null)
								}
								showTimeInput={true}
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
					<Spacer>
						<DatePicker
							value={publishedAt ? new Date(publishedAt) : null}
							onChange={(date) => setPublishedAt(date ? date.toISOString() : null)}
						/>
						<Tooltip position="right">
							<TooltipTrigger>
								<Icon className="a-info-icon" name="info" size="small" />
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
									label={tText(
										'admin/content/components/share-content-page-modal___annuleren'
									)}
									onClick={() => closeModal()}
								/>
								<Button
									type="primary"
									label={tText(
										'admin/content/components/share-content-page-modal___opslaan'
									)}
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
