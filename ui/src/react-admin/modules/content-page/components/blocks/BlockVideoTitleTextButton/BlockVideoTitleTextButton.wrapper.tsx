import { Button, ButtonAction, ButtonType, Column, Grid, IconName } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';
import React, { FC } from 'react';
import { BlockHeading } from '~content-blocks/BlockHeading/BlockHeading';
import { BlockRichTextWrapper } from '~content-blocks/BlockRichText';
import { BlockVideoWrapper } from '~content-blocks/BlockVideo';
import { AdminConfigManager } from '~core/config';
import Icon from '~shared/components/Icon/Icon';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink';
import { PermissionService } from '~shared/services/permission-service';

import { AlignOption, HeadingTypeOption } from '../../../types/content-block.types';

interface MediaPlayerTitleTextButtonWrapperProps {
	mediaItem: ButtonAction;
	mediaSrc?: string;
	mediaPoster?: string;
	mediaTitle: string;
	mediaExternalId: string;
	mediaIssued?: string;
	mediaOrganisation?: Avo.Organization.Organization;
	mediaDuration?: string;
	mediaAutoplay?: boolean;
	headingType: HeadingTypeOption;
	headingTitle: string;
	content: string;
	buttonLabel: string;
	buttonAltTitle?: string;
	buttonIcon?: IconName;
	buttonType?: ButtonType;
	buttonAction?: ButtonAction;
	align: AlignOption;
	commonUser?: Avo.User.CommonUser;
	showCopyright?: boolean;
}

export const BlockVideoTitleTextButtonWrapper: FC<MediaPlayerTitleTextButtonWrapperProps> = (
	props
) => {
	const {
		mediaItem,
		mediaSrc,
		mediaPoster,
		mediaTitle,
		mediaExternalId,
		mediaIssued,
		mediaOrganisation,
		mediaDuration,
		headingTitle,
		headingType,
		content,
		buttonIcon,
		buttonLabel,
		buttonType,
		buttonAltTitle,
		buttonAction,
		align,
		mediaAutoplay,
		commonUser,
		showCopyright,
	} = props;

	const shouldTitleLink =
		PermissionService.hasPerm(commonUser, PermissionName.VIEW_ANY_PUBLISHED_ITEMS) &&
		!!mediaItem;

	// Show copy right notice when the block requires it and the user is not logged in, or when they are editing the content page (preview)
	// https://meemoo.atlassian.net/browse/AVO-3015
	const showCopyrightNotice =
		showCopyright &&
		(!commonUser ||
			location.pathname.startsWith(
				AdminConfigManager.getConfig().routes.ADMIN_CONTENT_PAGE_OVERVIEW
			));
	console.log({
		showCopyright,
		commonUser,
		pathname: location.pathname,
		ADMIN_CONTENT_PAGE_OVERVIEW:
			AdminConfigManager.getConfig().routes.ADMIN_CONTENT_PAGE_OVERVIEW,
		showCopyrightNotice,
	});

	return (
		<Grid className="c-item-video-description">
			<Column size="2-7">
				<BlockVideoWrapper
					item={mediaItem}
					title={mediaTitle}
					external_id={mediaExternalId}
					duration={mediaDuration}
					autoplay={mediaAutoplay}
					src={mediaSrc}
					poster={mediaPoster}
					issued={mediaIssued}
					organisation={mediaOrganisation}
					showCopyright={showCopyrightNotice}
				/>
			</Column>
			<Column size="2-5" className={`u-text-${align}`}>
				{generateSmartLink(
					mediaItem,
					<BlockHeading
						type={headingType}
						className={shouldTitleLink ? 'u-clickable' : ''}
					>
						{headingTitle}
					</BlockHeading>
				)}
				<BlockRichTextWrapper elements={{ content }} />
				{buttonAction &&
					generateSmartLink(
						buttonAction,
						<Button
							label={buttonLabel}
							type={buttonType}
							renderIcon={
								buttonIcon ? () => <Icon name={buttonIcon as string} /> : undefined
							}
						/>,
						buttonAltTitle || buttonLabel
					)}
			</Column>
		</Grid>
	);
};
