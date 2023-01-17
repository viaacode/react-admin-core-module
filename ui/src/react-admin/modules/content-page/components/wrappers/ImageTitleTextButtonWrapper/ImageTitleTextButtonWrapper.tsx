import { BlockHeading, Button, Column, Grid, Image } from '@viaa/avo2-components';
import classNames from 'clsx';
import React, { FC } from 'react';
import { ImageTitleTextButtonBlockComponentState } from '~modules/content-page/types/content-block.types';
import { generateSmartLink } from '~modules/shared/components/SmartLink/SmartLink';

import RichTextWrapper from '../RichTextWrapper/RichTextWrapper';

export const ImageTitleTextButtonWrapper: FC<ImageTitleTextButtonBlockComponentState> = (props) => {
	const {
		buttonAction,
		buttonAltTitle,
		buttonIcon,
		buttonLabel,
		buttonType,
		content,
		headingTitle,
		headingType,
		imageAction,
		imageAlt,
		imagePosition,
		imageSource,
	} = props;

	const image = imageSource && <Image src={imageSource} alt={imageAlt || headingTitle} wide />;

	return (
		<Grid
			className={classNames(
				'c-item-video-description',
				`c-image-title-text-button-wrapper--image-${imagePosition}`
			)}
		>
			<Column size="2-7">
				{imageAction ? generateSmartLink(imageAction, image) : image}
			</Column>
			<Column size="2-5">
				{headingType && headingTitle && (
					<BlockHeading type={headingType}>{headingTitle}</BlockHeading>
				)}

				{content && <RichTextWrapper elements={{ content }} />}

				{buttonAction &&
					generateSmartLink(
						buttonAction,
						<Button icon={buttonIcon} label={buttonLabel} type={buttonType} />,
						buttonAltTitle || buttonLabel
					)}
			</Column>
		</Grid>
	);
};

export default ImageTitleTextButtonWrapper;
