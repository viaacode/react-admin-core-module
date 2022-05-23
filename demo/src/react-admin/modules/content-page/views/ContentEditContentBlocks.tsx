import { get } from 'lodash-es';
import React, { FunctionComponent, RefObject, useRef, useState } from 'react';

import { Navbar, Select } from '@viaa/avo2-components';

import ContentPage from '~modules/content-page/components/ContentPage/ContentPage';
import {
	CONTENT_BLOCK_CONFIG_MAP,
	GET_CONTENT_BLOCK_TYPE_OPTIONS,
} from '~modules/content-page/const/content-block.consts';
import { ContentEditAction } from '~modules/content-page/helpers/content-edit.reducer';
import {
	ContentBlockErrors,
	ContentBlockStateOption,
	ContentBlockStateType,
	ContentBlockType,
} from '~modules/content-page/types/content-block.types';
import {
	BlockClickHandler,
	ContentEditActionType,
	ContentPageInfo,
} from '~modules/content-page/types/content-pages.types';
import { ResizablePanels } from '~modules/shared/components/ResizablePanels/ResizablePanels';
import { Sidebar } from '~modules/shared/components/Sidebar/Sidebar';
import { createKey } from '~modules/shared/helpers/create-key';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

import './ContentEditContentBlocks.scss';
import { Config } from '~core/config';
import ContentBlockForm from '~modules/content-page/components/ContentBlockForm/ContentBlockForm';

interface ContentEditContentBlocksProps {
	contentPageInfo: Partial<ContentPageInfo>;
	hasSubmitted: boolean;
	changeContentPageState: (action: ContentEditAction) => void;
	onRemove: (configIndex: number) => void;
	onSave: (
		index: number,
		formGroupType: ContentBlockStateType,
		formGroupState: ContentBlockStateOption,
		stateIndex?: number
	) => void;
	addComponentToState: (index: number, blockType: ContentBlockType) => void;
	removeComponentFromState: (index: number, stateIndex: number) => void;
}

const ContentEditContentBlocks: FunctionComponent<ContentEditContentBlocksProps> = ({
	contentPageInfo,
	hasSubmitted,
	changeContentPageState,
	onRemove,
	onSave,
	addComponentToState,
	removeComponentFromState,
}) => {
	const { t } = useTranslation();

	// Hooks
	const [activeBlockPosition, setActiveBlockPosition] = useState<number | null>(null);

	const previewScrollable: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
	const sidebarScrollable: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

	// Methods
	const handleAddContentBlock = (configType: ContentBlockType) => {
		const newConfig = CONTENT_BLOCK_CONFIG_MAP[configType](
			(contentPageInfo.contentBlockConfigs || []).length
		);

		// Update content block configs
		changeContentPageState({
			type: ContentEditActionType.ADD_CONTENT_BLOCK_CONFIG,
			payload: newConfig,
		});

		// Scroll preview and sidebar to the bottom
		focusBlock(newConfig.position, 'preview');
		focusBlock(newConfig.position, 'sidebar');
	};

	const handleReorderContentBlock = (configIndex: number, indexUpdate: number) => {
		// Close accordions
		setActiveBlockPosition(null);
		// Trigger reorder
		changeContentPageState({
			type: ContentEditActionType.REORDER_CONTENT_BLOCK_CONFIG,
			payload: { configIndex, indexUpdate },
		});
	};

	/**
	 * https://imgur.com/a/E7TxvUN
	 * @param position
	 * @param type
	 */
	const scrollToBlockPosition: BlockClickHandler = (
		position: number,
		type: 'preview' | 'sidebar'
	) => {
		const blockElem = document.querySelector(`.content-block-${type}-${position}`);
		const scrollable = get(
			type === 'sidebar' ? sidebarScrollable : previewScrollable,
			'current'
		);
		if (!blockElem || !scrollable) {
			return;
		}
		const blockElemTop = blockElem.getBoundingClientRect().top;
		const scrollableTop = scrollable.getBoundingClientRect().top;
		const scrollTop = scrollable.scrollTop;
		const scrollMargin = type === 'sidebar' ? 18 : 0;
		const desiredScrollPosition = Math.max(
			blockElemTop - (scrollableTop - scrollTop) - scrollMargin,
			0
		);
		scrollable.scroll({ left: 0, top: desiredScrollPosition, behavior: 'smooth' });
	};

	const focusBlock: BlockClickHandler = (position: number, type: 'preview' | 'sidebar') => {
		toggleActiveBlock(position, type === 'preview');
		const inverseType = type === 'preview' ? 'sidebar' : 'preview';
		setTimeout(() => {
			scrollToBlockPosition(position, inverseType);
		}, 0);
	};

	const toggleActiveBlock = (position: number, onlyOpen: boolean) => {
		if (position === activeBlockPosition && !onlyOpen) {
			setActiveBlockPosition(null);
		} else {
			setActiveBlockPosition(position);
		}
	};

	// Render
	const renderContentBlockForms = () => {
		return (contentPageInfo.contentBlockConfigs || []).map((contentBlockConfig, index) => {
			return (
				<div
					className={`content-block-sidebar-${contentBlockConfig.position}`}
					key={createKey('form', index)}
				>
					<ContentBlockForm
						config={contentBlockConfig}
						blockIndex={index}
						isAccordionOpen={contentBlockConfig.position === activeBlockPosition}
						length={(contentPageInfo.contentBlockConfigs || []).length}
						hasSubmitted={hasSubmitted}
						toggleIsAccordionOpen={() => {
							focusBlock(contentBlockConfig.position, 'sidebar');
						}}
						onChange={(
							formGroupType: ContentBlockStateType,
							input: any,
							stateIndex?: number
						) => onSave(index, formGroupType, input, stateIndex)}
						addComponentToState={() =>
							addComponentToState(index, contentBlockConfig.type)
						}
						removeComponentFromState={(stateIndex: number) =>
							removeComponentFromState(index, stateIndex)
						}
						onError={(configIndex: number, errors: ContentBlockErrors) =>
							changeContentPageState({
								type: ContentEditActionType.SET_CONTENT_BLOCK_ERROR,
								payload: { configIndex, errors },
							})
						}
						onRemove={onRemove}
						onReorder={handleReorderContentBlock}
					/>
				</div>
			);
		});
	};

	return (
		<div className="m-resizable-panels m-edit-content-blocks">
			<ResizablePanels
				displayDirection="row"
				panelsSize={[60, 40]}
				sizeUnitMeasure="%"
				resizerSize="15px"
				onResize={() => {
					window.dispatchEvent(new Event('resize'));
				}}
			>
				<div className="c-content-edit-view__preview" ref={previewScrollable}>
					<ContentPage
						contentPageInfo={contentPageInfo}
						onBlockClicked={focusBlock}
						activeBlockPosition={activeBlockPosition}
						userGroupId={Config.getConfig()?.user?.userGroup?.id}
					/>
				</div>
				<Sidebar className="c-content-edit-view__sidebar" light>
					<Navbar background="alt">
						<Select
							options={GET_CONTENT_BLOCK_TYPE_OPTIONS()}
							onChange={(value) => handleAddContentBlock(value as ContentBlockType)}
							placeholder={t(
								'admin/content/views/content-edit-content-blocks___voeg-een-content-blok-toe'
							)}
							value={null as any}
						/>
					</Navbar>
					<div className="c-scrollable" ref={sidebarScrollable}>
						{renderContentBlockForms()}
					</div>
				</Sidebar>
			</ResizablePanels>
		</div>
	);
};

export default ContentEditContentBlocks;
