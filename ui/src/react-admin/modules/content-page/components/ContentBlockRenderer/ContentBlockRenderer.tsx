import { Container, Spacer } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { kebabCase, noop, omit } from 'lodash-es';
import type { FunctionComponent, RefObject } from 'react';
import React, { useCallback, useEffect, useRef } from 'react';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink';

import { GET_DARK_BACKGROUND_COLOR_OPTIONS } from '../../const/get-color-options';
import type { ContentBlockConfig } from '../../types/content-block.types';
import { Color, CustomBackground } from '../../types/content-block.types';

import {
	CONTENT_PAGE_ACCESS_BLOCKS,
	GET_BLOCK_COMPONENT,
	IGNORE_BLOCK_LEVEL_PROPS,
	NAVIGABLE_CONTENT_BLOCKS,
	REPEATABLE_CONTENT_BLOCKS,
	USER_CONTENT_BLOCKS,
} from './ContentBlockRenderer.const';

import './ContentBlockRenderer.scss';
import { AdminConfigManager } from '~core/config';
import type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { ContentPageWidth } from '~modules/content-page/types/content-pages.types';
import { GENERATED_CONTENT_BLOCK_ANCHOR_PREFIX } from '~modules/content-page/const/content-block-anchors.consts';

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
	const pageWidth =
		contentPageInfo.contentWidth?.toUpperCase() ||
		AdminConfigManager.getConfig().contentPage?.defaultPageWidth ||
		ContentPageWidth.EXTRA_LARGE;
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
			className={clsx(
				'c-content-block',
				className,
				'c-content-block__' + kebabCase(contentBlockConfig.type),
				{
					'c-content-block__meemoo-custom-background':
						blockState.backgroundColor === CustomBackground.MeemooLogo, // https://meemoo.atlassian.net/browse/ARC-1237
				}
			)}
			style={{
				background:
					blockState.backgroundColor === CustomBackground.MeemooLogo
						? Color.Transparent
						: blockState.backgroundColor,
				...(blockState.headerBackgroundColor !== Color.Transparent ? { zIndex: 1 } : {}),
			}}
			data-anchor={
				blockState.anchor || GENERATED_CONTENT_BLOCK_ANCHOR_PREFIX + contentBlockConfig.id
			}
			ref={blockRef}
			onClick={onClick}
		>
			{/*
			 * Separate div where we add the anchor id, so we can move this element higher,
			 * to avoid overlapping a fixed header when we jump to this anchor
			 * https://meemoo.atlassian.net/browse/AVO-3351
			 */}
			<div
				className="c-content-block__anchor"
				id={
					blockState.anchor ||
					GENERATED_CONTENT_BLOCK_ANCHOR_PREFIX + contentBlockConfig.id
				}
			></div>
			<Spacer
				className={clsx('c-content-block-preview', {
					'c-content-block-preview--dark': hasDarkBg,
					'u-color-white': hasDarkBg,
				})}
				margin={[blockState?.margin?.top ?? 'none', blockState?.margin?.bottom ?? 'none']}
				padding={[
					blockState?.padding?.top ?? 'none',
					blockState?.padding?.bottom ?? 'none',
				]}
			>
				<div
					className="c-content-block__header-bg-color"
					ref={headerBgRef}
					style={{
						background: blockState.headerBackgroundColor,
					}}
				/>
				{blockState.fullWidth ? (
					<PreviewComponent
						{...componentStateProps}
						{...blockStateProps}
						pageWidth={pageWidth}
					/>
				) : (
					<Container
						mode="horizontal"
						size={
							pageWidth?.toUpperCase() === ContentPageWidth.EXTRA_LARGE
								? undefined
								: (pageWidth?.toLowerCase() as 'medium' | 'large')
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
