import {
	Button,
	ButtonAction,
	ButtonType,
	Column,
	DefaultProps,
	Grid,
	HeadingType,
	IconName,
	MediaCard,
	MediaCardMetaData,
	MediaCardThumbnail,
	MetaData,
	MetaDataItem,
	MetaDataItemProps,
	Orientation,
	RenderLinkFunction,
	Spacer,
	Thumbnail,
	Toolbar,
	ToolbarLeft,
	ToolbarRight,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import React, { FunctionComponent, ReactNode } from 'react';
import Icon from '~shared/components/Icon/Icon';
import { defaultRenderLinkFunction } from '~shared/helpers/link';

import { BlockHeading } from '../BlockHeading/BlockHeading';

import './BlockMediaGrid.scss';

export type MediaListItem = {
	category: Avo.ContentType.English;
	metadata?: MetaDataItemProps[];
	thumbnail?: { label: string; meta?: string; src?: string };
	src?: string;
	title: string;
	itemAction: ButtonAction;
	buttonLabel?: string;
	buttonAltTitle?: string;
	buttonIcon?: IconName;
	buttonType?: ButtonType;
	buttonAction?: ButtonAction;
};

export interface BlockMediaGridProps extends DefaultProps {
	title?: string;
	buttonLabel?: string;
	buttonAltTitle?: string;
	buttonAction?: ButtonAction;
	ctaTitle?: string;
	ctaTitleColor?: string;
	ctaTitleSize?: HeadingType;
	ctaContent?: string;
	ctaContentColor?: string;
	ctaButtonLabel?: string;
	ctaButtonAltTitle?: string;
	ctaButtonType?: ButtonType;
	ctaButtonIcon?: IconName;
	ctaBackgroundColor?: string;
	ctaBackgroundImage?: string;
	ctaWidth?: string;
	ctaButtonAction?: ButtonAction;
	fullWidth?: boolean;
	elements: MediaListItem[];
	orientation?: Orientation;
	renderLink?: RenderLinkFunction;
	renderMediaCardWrapper: (mediaCard: ReactNode, item: MediaListItem) => ReactNode;
}

export const BlockMediaGrid: FunctionComponent<BlockMediaGridProps> = ({
	title,
	buttonLabel,
	buttonAltTitle,
	buttonAction,
	ctaTitle = '',
	ctaTitleColor,
	ctaTitleSize = 'h4',
	ctaContent = '',
	ctaContentColor,
	ctaButtonLabel = '',
	ctaButtonAltTitle = '',
	ctaBackgroundColor,
	ctaBackgroundImage,
	ctaButtonType = 'secondary',
	ctaButtonIcon,
	ctaButtonAction,
	fullWidth = false,
	className,
	elements = [],
	orientation,
	renderLink = defaultRenderLinkFunction,
	renderMediaCardWrapper,
}) => {
	const hasCTA = ctaTitle || ctaButtonLabel || ctaContent;

	const renderCTA = () => {
		return (
			<>
				<div className="c-media-card-thumb">
					<div
						className="c-thumbnail"
						style={{
							backgroundImage: ctaBackgroundImage
								? `url('${ctaBackgroundImage}')`
								: 'none',
							background: ctaBackgroundColor,
						}}
					>
						<div className="c-thumbnail__content">
							{ctaTitle && (
								<BlockHeading type={ctaTitleSize} color={ctaTitleColor}>
									{ctaTitle}
								</BlockHeading>
							)}
							{ctaContent && (
								<div style={{ color: ctaContentColor }}>{ctaContent}</div>
							)}
						</div>
					</div>
				</div>
				<div className="c-media-card-content">
					{!!elements.at(-1)?.buttonLabel && !fullWidth && (
						<div>
							<h4 className="c-media-card__title">titel</h4>
							<MetaData category="item">
								<MetaDataItem key={'block-media-list-meta-cta'} label="meta" />
							</MetaData>
						</div>
					)}
					<Spacer margin="top-small">
						<Button
							label={ctaButtonLabel}
							type={ctaButtonType}
							renderIcon={
								ctaButtonIcon ? () => <Icon name={ctaButtonIcon} /> : undefined
							}
						/>
					</Spacer>
				</div>
			</>
		);
	};

	const renderMediaCard = (mediaListItem: MediaListItem) => {
		const { category, metadata, thumbnail, title, buttonLabel, buttonIcon, buttonType } =
			mediaListItem;

		return (
			<MediaCard category={category} orientation={orientation} title={title}>
				{thumbnail && (
					<MediaCardThumbnail>
						<Thumbnail alt={title} category={category} {...thumbnail} />
					</MediaCardThumbnail>
				)}
				<MediaCardMetaData>
					<div>
						{metadata && metadata.length > 0 && (
							<MetaData category={category}>
								{metadata.map((props, i) => (
									<MetaDataItem key={`block-media-list-meta-${i}`} {...props} />
								))}
							</MetaData>
						)}
						{(!!buttonIcon || !!buttonLabel) && (
							<Spacer margin="top-small">
								<div
									onClick={(evt) => {
										evt.stopPropagation(); // Avoid triggering the click on the media card
									}}
								>
									{renderLink(
										mediaListItem.buttonAction || mediaListItem.itemAction,
										<Button
											label={buttonLabel}
											type={buttonType}
											renderIcon={
												buttonIcon
													? () => <Icon name={buttonIcon} />
													: undefined
											}
										/>,
										mediaListItem.buttonLabel || mediaListItem.title,
										mediaListItem.buttonAltTitle ||
											mediaListItem.buttonLabel ||
											mediaListItem.title
									)}
								</div>
							</Spacer>
						)}
					</div>
				</MediaCardMetaData>
			</MediaCard>
		);
	};

	return (
		<div className={clsx(className, 'c-block-media-list c-media-card-list')}>
			{(!!title || !!buttonLabel) && (
				<Toolbar>
					<ToolbarLeft>
						{title && <BlockHeading type="h2">{title}</BlockHeading>}
					</ToolbarLeft>
					<ToolbarRight>
						{buttonLabel &&
							renderLink(
								buttonAction,
								<Button label={buttonLabel} type="secondary" />,
								buttonLabel,
								buttonAltTitle || buttonLabel
							)}
					</ToolbarRight>
				</Toolbar>
			)}
			<Grid>
				{elements.map((mediaListItem, i) => {
					return (
						<Column key={`block-media-list-${i}`} size={fullWidth ? '3-12' : '3-3'}>
							{renderMediaCardWrapper(renderMediaCard(mediaListItem), mediaListItem)}
						</Column>
					);
				})}
				{hasCTA && (
					<Column size={fullWidth ? '3-12' : '3-3'}>
						<div className={clsx(className, 'c-media-card', 'c-media-card__cta')}>
							{renderLink(
								ctaButtonAction,
								renderCTA(),
								ctaButtonLabel || ctaTitle,
								ctaButtonAltTitle || ctaButtonLabel || ctaTitle
							)}
						</div>
					</Column>
				)}
			</Grid>
		</div>
	);
};
