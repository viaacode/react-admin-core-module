import { Container, Spacer } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { noop, omit } from 'lodash-es';
import React, { FunctionComponent, RefObject, useCallback, useEffect, useRef } from 'react';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink';

import { GET_DARK_BACKGROUND_COLOR_OPTIONS } from '../../const/get-color-options';
import { Color, ContentBlockConfig } from '../../types/content-block.types';

import {
	CONTENT_PAGE_ACCESS_BLOCKS,
	GET_BLOCK_COMPONENT,
	IGNORE_BLOCK_LEVEL_PROPS,
	NAVIGABLE_CONTENT_BLOCKS,
	OPEN_MEDIA_IN_POPUP_CONTENT_BLOCKS,
	REPEATABLE_CONTENT_BLOCKS,
	USER_CONTENT_BLOCKS,
} from './ContentBlockRenderer.const';

import './ContentBlockRenderer.scss';
import { AdminConfigManager } from '~core/config';
import { ContentPageInfo, ContentWidth } from '~modules/content-page/types/content-pages.types';

interface ContentBlockPreviewProps {
	contentBlockConfig: ContentBlockConfig;
	contentPageInfo: Partial<ContentPageInfo>;
	onClick: () => void;
	className?: string;
	commonUser?: Avo.User.CommonUser;
}

/* eslint-enable @typescript-eslint/no-unused-vars */

const ContentBlockRenderer: FunctionComponent<ContentBlockPreviewProps> = ({
	contentBlockConfig,
	contentPageInfo,
	onClick = noop,
	className,
	commonUser,
}) => {
	const blockState = contentBlockConfig?.block?.state;
	const componentState = contentBlockConfig?.components?.state;
	const containerSize =
		contentPageInfo.contentWidth?.toUpperCase() ||
		AdminConfigManager.getConfig().contentPage?.defaultPageWidth ||
		ContentWidth.EXTRA_LARGE;
	const PreviewComponent = GET_BLOCK_COMPONENT(contentBlockConfig.type);
	const needsElements = REPEATABLE_CONTENT_BLOCKS.includes(contentBlockConfig.type);
	const componentStateProps: any = needsElements ? { elements: componentState } : componentState;

	const blockRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
	const headerBgRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

	const blockStateProps: { [key: string]: any } = omit(blockState, IGNORE_BLOCK_LEVEL_PROPS);

	const getHeaderHeight = useCallback((): string | null => {
		if (!blockRef.current) {
			return null;
		}
		const header: HTMLElement | null = blockRef.current.querySelector(
			'.c-content-page-overview-block__header'
		);
		if (!header) {
			return null;
		}
		header.style.opacity = '1';
		const height = header.getBoundingClientRect().height || 0;
		if (height) {
			return `${height + 16}px`;
		}
		return '0';
	}, [blockRef]);

	useEffect(() => {
		const timerId = setInterval(() => {
			if (headerBgRef && headerBgRef.current) {
				const height = getHeaderHeight();
				headerBgRef.current.style.height = height || '0';
			}
		}, 300);

		return () => {
			clearInterval(timerId);
		};
	}, [blockState.headerBackgroundColor, getHeaderHeight, headerBgRef]);

	if (NAVIGABLE_CONTENT_BLOCKS.includes(contentBlockConfig.type)) {
		// Pass a function to the block, so it can render links without needing to know anything about the app routes
		// You pass in the buttonAction and the children of the link
		// And you receive a ReactNode that wraps the children in the correct link tag
		blockStateProps.renderLink = generateSmartLink;
	}

	if (USER_CONTENT_BLOCKS.includes(contentBlockConfig.type)) {
		// Give the block access to the current logged-in user in theAvo.User.CommonUser format
		blockStateProps.commonUser = commonUser;
	}

	if (OPEN_MEDIA_IN_POPUP_CONTENT_BLOCKS.includes(contentBlockConfig.type)) {
		// Pass a function to the block, so it can render a wrapper to open media items in a modal
		// Without the admin core needing to know about users, bookmarks, ...
		blockStateProps.mediaItemClicked = AdminConfigManager.getConfig().handlers.mediaItemClicked;
	}

	// Pass the content page object to the block
	if (CONTENT_PAGE_ACCESS_BLOCKS.includes(contentBlockConfig.type)) {
		// Set profile to current user for unsaved pages
		blockStateProps.contentPageInfo = {
			...contentPageInfo,
			profile: contentPageInfo.owner || {
				id: commonUser?.profileId,
				fullName: commonUser?.fullName,
				firstName: commonUser?.firstName,
				lastName: commonUser?.lastName,
				groupId: commonUser?.userGroup?.id,
				groupName: commonUser?.userGroup?.label,
			},
		};
	}

	const hasDarkBg = GET_DARK_BACKGROUND_COLOR_OPTIONS().includes(blockState.backgroundColor);

	return (
		<div
			className={clsx('c-content-block', className)}
			style={{
				backgroundColor: blockState.backgroundColor,
				...(blockState.headerBackgroundColor !== Color.Transparent ? { zIndex: 1 } : {}),
			}}
			id={blockState.anchor}
			data-anchor={blockState.anchor}
			ref={blockRef}
			onClick={onClick}
		>
			<Spacer
				className={clsx('c-content-block-preview', {
					'c-content-block-preview--dark': hasDarkBg,
					'u-color-white': hasDarkBg,
				})}
				margin={[blockState?.margin?.top || 'none', blockState?.margin?.bottom || 'none']}
				padding={[
					blockState?.padding?.top || 'none',
					blockState?.padding?.bottom || 'none',
				]}
			>
				<div
					className="c-content-block__header-bg-color"
					ref={headerBgRef}
					style={{
						backgroundColor: blockState.headerBackgroundColor,
					}}
				/>
				{blockState.fullWidth ? (
					<PreviewComponent {...componentStateProps} {...blockStateProps} />
				) : (
					<Container
						mode="horizontal"
						size={
							containerSize?.toUpperCase() === ContentWidth.EXTRA_LARGE
								? undefined
								: (containerSize?.toLowerCase() as 'medium' | 'large')
						}
					>
						<PreviewComponent {...componentStateProps} {...blockStateProps} />
					</Container>
				)}
			</Spacer>
		</div>
	);
};

export default ContentBlockRenderer;
