import {
	Accordion,
	AccordionActions,
	AccordionBody,
	AccordionTitle,
	Button,
	ButtonGroup,
	ButtonToolbar,
	Flex,
	FlexItem,
	Form,
	IconName,
	Spacer,
	Toolbar,
	ToolbarLeft,
	ToolbarRight,
} from '@viaa/avo2-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import React, { FunctionComponent, ReactNode } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { findImageInJson } from '~shared/helpers/find-image-in-json';

import { validateContentBlockField } from '~shared/helpers/validation';
import {
	ContentBlockBlockConfig,
	ContentBlockComponentsConfig,
	ContentBlockComponentState,
	ContentBlockConfig,
	ContentBlockErrors,
	ContentBlockState,
	ContentBlockStateType,
	RepeatedContentBlockComponentState,
} from '../../types/content-block.types';
import ContentBlockFormGroup from '../ContentBlockFormGroup/ContentBlockFormGroup';
import { REPEATABLE_CONTENT_BLOCKS } from '.././ContentBlockRenderer/ContentBlockRenderer.const';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { useTranslation } from '~shared/hooks/useTranslation';
import { BlockHeading } from '~content-blocks/BlockHeading/BlockHeading';

import './ContentBlockForm.scss';

interface ContentBlockFormProps {
	config: ContentBlockConfig;
	blockIndex: number;
	isAccordionOpen: boolean;
	length: number;
	hasSubmitted: boolean;
	onChange: (formGroupType: ContentBlockStateType, input: any, stateIndex?: number) => void;
	onError: (configIndex: number, newErrors: ContentBlockErrors) => void;
	onRemove: (configIndex: number) => void;
	onReorder: (configIndex: number, indexUpdate: number) => void;
	toggleIsAccordionOpen: () => void;
	addComponentToState: () => void;
	removeComponentFromState: (stateIndex: number) => void;
}

const ContentBlockForm: FunctionComponent<ContentBlockFormProps> = ({
	config,
	blockIndex,
	isAccordionOpen,
	length,
	hasSubmitted,
	onChange,
	onError,
	onRemove,
	onReorder,
	toggleIsAccordionOpen,
	addComponentToState,
	removeComponentFromState,
}) => {
	const { components, block } = config;
	const { isArray } = Array;
	const configErrors = config.errors || {};

	// Hooks
	const { tText } = useTranslation();

	// Methods
	const handleChange = (
		formGroupType: ContentBlockStateType,
		key: keyof ContentBlockComponentState | keyof ContentBlockState,
		value: any,
		stateIndex?: number
	) => {
		const updateObject = {
			[key]: value,
		};
		const state = formGroupType === 'block' ? block.state : components.state;
		const stateUpdate = isArray(state) ? [updateObject] : { ...state, ...updateObject };

		handleValidation(key, formGroupType, value, stateIndex);
		onChange(formGroupType, stateUpdate, isArray(components.state) ? stateIndex : undefined);
	};

	const handleValidation = (
		fieldKey: keyof ContentBlockComponentState | keyof ContentBlockState,
		formGroupType: ContentBlockStateType,
		updatedFormValue: any,
		stateIndex?: number
	) => {
		const field = config[formGroupType].fields[fieldKey];
		const validator = field?.validator;

		const errors = validateContentBlockField(
			fieldKey,
			validator,
			configErrors,
			updatedFormValue,
			stateIndex
		);

		onError(blockIndex, errors);
	};

	const renderRemoveButton = (stateIndex: number) => {
		const aboveMin =
			isArray(components.state) && components.state.length > (components?.limits?.min || 1);

		return (
			removeComponentFromState &&
			aboveMin && (
				<FlexItem className="u-flex-align-end" shrink>
					<Button
						icon={'delete' as IconName}
						type="danger"
						onClick={() => removeComponentFromState(stateIndex)}
						size="small"
						title={tText(
							'admin/content-block/components/content-block-form/content-block-form___verwijder-sectie'
						)}
						ariaLabel={tText(
							'admin/content-block/components/content-block-form/content-block-form___verwijder-sectie'
						)}
					/>
				</FlexItem>
			)
		);
	};

	const renderFormGroups = (
		formGroup: ContentBlockComponentsConfig | ContentBlockBlockConfig,
		formGroupType: ContentBlockStateType
	) => {
		const formGroupOptions = {
			config,
			blockIndex,
			formGroup,
			formGroupType,
			handleChange,
		};

		// Render each state individually in a ContentBlockFormGroup
		return (
			<Spacer margin="top-small">
				{isArray(formGroup.state) ? (
					formGroup.state.map(
						(formGroupState: RepeatedContentBlockComponentState, stateIndex) => (
							<Spacer key={stateIndex} margin="bottom">
								<BlockHeading type="h4" className="u-m-t-0 u-spacer-bottom-s">
									<Toolbar autoHeight>
										<ToolbarLeft>{`${config?.components?.name} ${
											stateIndex + 1
										}`}</ToolbarLeft>
										<ToolbarRight>
											{renderRemoveButton(stateIndex)}
										</ToolbarRight>
									</Toolbar>
								</BlockHeading>
								<Flex spaced="regular" wrap>
									<FlexItem>
										<ContentBlockFormGroup
											key={stateIndex}
											{...formGroupOptions}
											formGroupState={formGroupState}
											stateIndex={stateIndex}
										/>
									</FlexItem>
								</Flex>
							</Spacer>
						)
					)
				) : (
					<ContentBlockFormGroup {...formGroupOptions} formGroupState={formGroup.state} />
				)}
			</Spacer>
		);
	};

	const renderAddButton = (label: string) => (
		<Spacer margin="bottom">
			<Button
				label={tText(
					'admin/content-block/components/content-block-form/content-block-form___voeg-label-to',
					{ label }
				)}
				title={tText(
					'admin/content-block/components/content-block-form/content-block-form___voeg-sectie-toe'
				)}
				icon={'add' as IconName}
				type="secondary"
				onClick={addComponentToState}
			/>
		</Spacer>
	);

	const renderImageOrTitleAcronym = (contentBlock: ContentBlockConfig): ReactNode => {
		const imageUrl: string | null = findImageInJson(contentBlock);
		if (imageUrl) {
			return (
				<div
					style={{ backgroundImage: `url(${imageUrl})` }}
					className="c-content-block-form__accordion__header__preview--image"
				></div>
			);
		} else {
			return (
				<div className="c-content-block-form__accordion__header__preview--text">
					{contentBlock.name.substring(0, 2)}
				</div>
			);
		}
	};

	const renderBlockForm = (contentBlock: ContentBlockConfig) => {
		const accordionTitle = `${contentBlock.name} (${blockIndex + 1}/${length})`;
		const label = (contentBlock?.components?.name || '').toLowerCase();
		const underLimit =
			isNil(components?.limits?.max) ||
			(isArray(components.state) && components.state.length < (components?.limits?.max || 1));

		return (
			<Accordion
				className={clsx('c-content-block-form__accordion', {
					'has-error': hasSubmitted && Object.keys(configErrors).length > 0,
				})}
				isOpen={isAccordionOpen}
				onToggle={toggleIsAccordionOpen}
			>
				<AccordionTitle>
					{renderImageOrTitleAcronym(contentBlock)}
					<span>{accordionTitle}</span>
				</AccordionTitle>
				<AccordionActions>
					<ButtonToolbar>
						<ButtonGroup className="u-nowrap">
							<Button
								disabled={blockIndex === 0}
								icon={'chevronUp' as IconName}
								onClick={() => onReorder(blockIndex, -1)}
								size="small"
								title={tText(
									'admin/content-block/components/content-block-form/content-block-form___verplaats-naar-boven'
								)}
								ariaLabel={tText(
									'admin/content-block/components/content-block-form/content-block-form___verplaats-naar-boven'
								)}
								type="tertiary"
							/>
							<Button
								disabled={blockIndex + 1 === length}
								icon={'chevronDown' as IconName}
								onClick={() => onReorder(blockIndex, 1)}
								size="small"
								title={tText(
									'admin/content-block/components/content-block-form/content-block-form___verplaats-naar-onder'
								)}
								ariaLabel={tText(
									'admin/content-block/components/content-block-form/content-block-form___verplaats-naar-onder'
								)}
								type="tertiary"
							/>
						</ButtonGroup>
						<CopyToClipboard
							text={JSON.stringify({ block: config })}
							onCopy={() =>
								AdminConfigManager.getConfig().services.toastService.showToast({
									title: AdminConfigManager.getConfig().services.i18n.tText(
										'modules/content-page/components/content-block-form/content-block-form___gekopieerd'
									),
									description: AdminConfigManager.getConfig().services.i18n.tText(
										'admin/content-block/components/content-block-form/content-block-form___de-blok-is-naar-je-klembord-gekopieerd-druk-ctrl-v-om-hem-te-plakken'
									),
									type: ToastType.SUCCESS,
								})
							}
						>
							<Button
								icon={'copy' as IconName}
								size="small"
								title={tText(
									'admin/content-block/components/content-block-form/content-block-form___kopieer-content-blok'
								)}
								ariaLabel={tText(
									'admin/content-block/components/content-block-form/content-block-form___kopieer-content-blok'
								)}
								type="secondary"
							/>
						</CopyToClipboard>
						<Button
							icon={'delete' as IconName}
							onClick={() => onRemove(blockIndex)}
							size="small"
							title={tText(
								'admin/content-block/components/content-block-form/content-block-form___verwijder-content-block'
							)}
							ariaLabel={tText(
								'admin/content-block/components/content-block-form/content-block-form___verwijder-content-block'
							)}
							type="danger"
						/>
					</ButtonToolbar>
				</AccordionActions>

				{isAccordionOpen && (
					<AccordionBody>
						{renderFormGroups(components, 'components')}
						{underLimit &&
							REPEATABLE_CONTENT_BLOCKS.includes(config.type) &&
							renderAddButton(label)}
						<Spacer margin="top">
							<BlockHeading type="h4" className="u-m-t-0">
								Blok-opties
							</BlockHeading>
						</Spacer>
						<Spacer margin="bottom-small">{renderFormGroups(block, 'block')}</Spacer>
					</AccordionBody>
				)}
			</Accordion>
		);
	};

	return <Form className="c-content-block-form">{renderBlockForm(config)}</Form>;
};

export default ContentBlockForm;
