import clsx from 'clsx';
import type { FunctionComponent, ReactElement } from 'react';
import type {
	BackgroundAlignOption,
	Color,
	HeadingTypeOption,
	SimpleAlignOption,
} from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { BlockHeading } from '../BlockHeading';
import type { ButtonAction, ButtonType, IconName } from '@viaa/avo2-components';
import { Button, Image } from '@viaa/avo2-components';
import { generateSmartLink } from '~modules/shared/components/SmartLink/SmartLink';
import { Icon } from '~modules/shared/components';

export interface BlockImageTextBackgroundProps extends DefaultComponentProps {
	heading: string;
	headingType: HeadingTypeOption;
	content: string;
	foregroundColor: Color;
	backgroundColor: Color;
	image?: string;
	imageAlignment?: BackgroundAlignOption;
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
	imageAlignment = 'left-screen',
	buttonAction,
	buttonAltTitle,
	buttonLabel,
	buttonType,
	buttonIcon,
	buttonIconAlignment = 'left',
}): ReactElement => {
	return (
		<article
			className={clsx(
				`c-block-image-text-background c-block-image-text-background--${imageAlignment}`,
				className
			)}
			style={{ background: backgroundColor }}
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
							className={`c-block-image-text-background__button c-block-image-text-background__button-icon--${buttonIconAlignment}`}
							label={buttonLabel}
							type={buttonType}
							icon={buttonIcon}
							iconPosition={buttonIconAlignment}
							renderIcon={() => (buttonIcon ? <Icon name={buttonIcon} /> : null)}
						/>,
						buttonAltTitle || buttonLabel
					)}
			</div>
			{image && (
				<Image
					src={image}
					className={clsx('c-block-image-text-background__image-wrapper', {
						'c-block-image-text-background__image-wrapper--screen-left':
							imageAlignment === 'left-screen',
						'c-block-image-text-background__image-wrapper--screen-right':
							imageAlignment === 'right-screen',
					})}
				/>
			)}
		</article>
	);
};
