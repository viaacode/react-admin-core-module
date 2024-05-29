import { Button, IconName } from '@viaa/avo2-components';
import { IconNameSchema } from '@viaa/avo2-components/dist/components/Icon/Icon.types';
import { compact } from 'lodash-es';
import React, { FC, useMemo } from 'react';
import { TYPE_TO_ICON_MAP } from '~content-blocks/BlockContentEnclose/BlockContentEnclose.const';
import {
	BlockContentEncloseProps,
	MappedElement,
} from '~content-blocks/BlockContentEnclose/BlockContentEnclose.types';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { AdminConfigManager } from '~core/config';
import { Link } from '~modules/shared/components/Link';
import { Icon } from '~shared/components';
import Html from '~shared/components/Html/Html';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink';
import { tText } from '~shared/helpers/translation-functions';
import { useGetContentBlockEncloseContent } from './hooks/useGetContentBlockEncloseContent';

export const BlockContentEnclose: FC<BlockContentEncloseProps> = ({
	title,
	titleType,
	description,
	buttonLabel,
	buttonAction,
	buttonType,
	buttonIcon,
	buttonAltTitle,
	elements,
}) => {
	const elementTypeAndIds: (MappedElement | undefined)[] = useMemo(
		() =>
			compact(
				elements.map((element) => {
					if (!element?.mediaItem?.value) {
						return;
					}
					return {
						value: element.mediaItem.value,
						type: element.mediaItem.type,
					};
				})
			),
		[elements]
	);

	const elementInfos = useGetContentBlockEncloseContent(
		elementTypeAndIds as MappedElement[],
		elements
	);

	return (
		<section className="l-container">
			<div className="c-block-enclosed-content__header">
				<div>
					<BlockHeading className="c-block-enclosed-content__title" type={titleType}>
						{title}
					</BlockHeading>
					{description && <p>{description}</p>}
				</div>
				{buttonAction &&
					generateSmartLink(
						buttonAction,
						<Button
							label={buttonLabel}
							type={buttonType}
							renderIcon={buttonIcon ? () => <Icon name={buttonIcon} /> : undefined}
						/>,
						buttonAltTitle || buttonLabel
					)}
			</div>
			<ul className="c-block-enclosed-content__cards">
				{elementInfos?.map((elementInfo, index) => {
					return (
						<li
							className="c-block-enclosed-content__cards__card"
							key={`${elementInfo?.id}-${index}`}
						>
							<Link to={elementInfo.link}>
								<div
									className="c-block-enclosed-content__cards__card__image"
									style={{
										backgroundImage: `url(${
											elementInfo.objectType !== ('audio' as IconNameSchema)
												? elementInfo?.thumbnail
												: AdminConfigManager.getConfig().components
														.defaultAudioStill
										})`,
									}}
								>
									{elementInfo?.thumbnail ||
									elementInfo?.objectType === 'audio' ? (
										elementInfo.objectType &&
										TYPE_TO_ICON_MAP[elementInfo.objectType] ? (
											<div className="c-block-enclosed-content__cards__card__image__icon">
												<Icon
													name={
														TYPE_TO_ICON_MAP[
															elementInfo.objectType
														] as IconName
													}
												/>
											</div>
										) : null
									) : (
										<Icon
											className="c-block-enclosed-content__cards__card__image__no-permission"
											name={
												AdminConfigManager.getConfig().icon?.componentProps
													.eyeOff.name as IconName
											}
										/>
									)}
								</div>
								<div className="c-block-enclosed-content__cards__card__wrapper">
									<span className="c-block-enclosed-content__cards__card__title">
										{elementInfo?.name ||
											tText(
												'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___geen-toegang'
											)}
									</span>
									<div className="c-block-enclosed-content__cards__card__description-wrapper">
										<Html
											content={
												elementInfo?.description ||
												tText(
													'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___geen-toegang'
												)
											}
											className="c-block-enclosed-content__cards__card__description"
										/>
									</div>
								</div>
								{elementInfo?.type === 'IE_OBJECT' ? (
									<div className={'c-block-enclosed-content__cards__card__meta'}>
										<div className="c-block-enclosed-content__cards__card__meta__maintainer">
											{elementInfo?.maintainerName}
										</div>
										<div className="c-block-enclosed-content__cards__card__meta__date">
											{elementInfo?.dateCreated}
										</div>
										<div>{elementInfo?.pid}</div>
									</div>
								) : null}
							</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
};
