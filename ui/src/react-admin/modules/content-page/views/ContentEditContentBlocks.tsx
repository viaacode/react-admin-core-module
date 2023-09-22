import type { Avo } from '@viaa/avo2-types';
import { get } from 'lodash-es';
import React, { FunctionComponent, RefObject, useRef, useState } from 'react';

import { Navbar, Select } from '@viaa/avo2-components';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import ContentPageRenderer from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import { GET_CONTENT_BLOCK_TYPE_OPTIONS } from '~modules/content-page/const/get-content-block-type-options';
import { CONTENT_BLOCK_CONFIG_MAP } from '~modules/content-page/const/content-block-config-map';
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
import { Sidebar } from '~shared/components/Sidebar/Sidebar';
import { createKey } from '~shared/helpers/create-key';
import { useTranslation } from '~shared/hooks/useTranslation';
import ContentBlockForm from '~modules/content-page/components/ContentBlockForm/ContentBlockForm';

import './ContentEditContentBlocks.scss';

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
	commonUser: Avo.User.CommonUser;
}

const ContentEditContentBlocks: FunctionComponent<ContentEditContentBlocksProps> = ({
	contentPageInfo,
	hasSubmitted,
	changeContentPageState,
	onRemove,
	onSave,
	addComponentToState,
	removeComponentFromState,
	commonUser,
}) => {
	const { tText } = useTranslation();

	// Hooks
	const [activeBlockPosition, setActiveBlockPosition] = useState<number | null>(null);

	const previewScrollable: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
	const sidebarScrollable: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

	// Methods
	const handleAddContentBlock = (configType: ContentBlockType) => {
		const newConfig = CONTENT_BLOCK_CONFIG_MAP[configType](
			(contentPageInfo.content_blocks || []).length
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
		return (contentPageInfo.content_blocks || []).map((contentBlockConfig, index) => {
			return (
				<div
					className={`content-block-sidebar-${contentBlockConfig.position}`}
					key={createKey('form', index)}
				>
					<ContentBlockForm
						config={contentBlockConfig}
						blockIndex={index}
						isAccordionOpen={contentBlockConfig.position === activeBlockPosition}
						length={(contentPageInfo.content_blocks || []).length}
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
			<PanelGroup
				direction="horizontal"
				onLayout={() => window.dispatchEvent(new Event('resize'))}
			>
				<Panel defaultSize={60}>
					<div className="c-content-edit-view__preview" ref={previewScrollable}>
						<ContentPageRenderer
							contentPageInfo={contentPageInfo}
							onBlockClicked={focusBlock}
							activeBlockPosition={activeBlockPosition}
							commonUser={commonUser}
						/>
					</div>
				</Panel>
				<PanelResizeHandle />
				<Panel defaultSize={40}>
					<Sidebar className="c-content-edit-view__sidebar" light>
						<Navbar background="alt">
							<Select
								options={GET_CONTENT_BLOCK_TYPE_OPTIONS()}
								onChange={(value) =>
									handleAddContentBlock(value as ContentBlockType)
								}
								placeholder={tText(
									'admin/content/views/content-edit-content-blocks___voeg-een-content-blok-toe'
								)}
								value={null as any}
							/>
						</Navbar>
						<div className="c-scrollable" ref={sidebarScrollable}>
							{renderContentBlockForms()}
						</div>
					</Sidebar>
				</Panel>
			</PanelGroup>
		</div>
	);
};

export default ContentEditContentBlocks;
