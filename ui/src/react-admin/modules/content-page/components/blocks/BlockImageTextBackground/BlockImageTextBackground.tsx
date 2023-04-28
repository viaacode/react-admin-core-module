import classnames from 'classnames';
import { FunctionComponent, ReactElement } from 'react';
import {
	Color,
	HeadingTypeOption,
	SimpleAlignOption,
} from '~modules/content-page/types/content-block.types';
import { DefaultComponentProps } from '~modules/shared/types/components';
import { BlockHeading } from '../BlockHeading';
import { Button, ButtonAction, ButtonType, IconName, Image } from '@viaa/avo2-components';
import { generateSmartLink } from '~modules/shared/components/SmartLink/SmartLink';

export interface BlockImageTextBackgroundProps extends DefaultComponentProps {
	heading: string;
	headingType: HeadingTypeOption;
	content: string;
	foregroundColor: Color;
	backgroundColor: Color;
	image?: string;
	contentAlignment?: SimpleAlignOption;
	buttonAction?: ButtonAction;
	buttonAltTitle?: string;
	buttonLabel: string;
	buttonType?: ButtonType;
	buttonIcon?: IconName;
	buttonIconAlignment?: SimpleAlignOption;
}

export const BlockImageTextBackground: FunctionComponent<BlockImageTextBackgroundProps> = ({
	className,
	heading,
	headingType,
	content,
	foregroundColor,
	backgroundColor,
	image,
	contentAlignment,
	buttonAction,
	buttonAltTitle,
	buttonLabel,
	buttonType,
	buttonIcon,
	buttonIconAlignment = 'right',
}): ReactElement => {
	return (
		<article
			className={classnames(
				`c-block-image-text-background c-block-image-text-background--${contentAlignment}`,
				className
			)}
			style={{ backgroundColor }}
		>
			<div
				className="c-block-image-text-background__content-wrapper"
				style={{ color: foregroundColor }}
			>
				<BlockHeading className="c-block-image-text-background__heading" type={headingType}>
					{heading}
				</BlockHeading>
				<p className="c-block-image-text-background__content">{content}</p>

				{buttonAction &&
					generateSmartLink(
						buttonAction,
						<Button
							className={`c-block-image-text-background__button c-block-image-text-background__button-icon--${contentAlignment}`}
							icon={buttonIcon}
							label={buttonLabel}
							type={buttonType}
						/>,
						buttonAltTitle || buttonLabel
					)}
			</div>
			{image && (
				<Image src={image} className="c-block-image-text-background__image-wrapper" />
			)}
		</article>
	);
};
