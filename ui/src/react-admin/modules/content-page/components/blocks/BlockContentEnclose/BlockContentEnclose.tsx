import React, { FC, useEffect, useMemo } from 'react';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { Button } from '@viaa/avo2-components';
import { Icon } from '~shared/components';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink';
import {
	BlockContentEncloseProps,
	MappedObject,
} from '~content-blocks/BlockContentEnclose/BlockContentEnclose.types';
import { useGetContentBlockEnloseContent } from '~content-blocks/BlockContentEnclose/hooks/useGetContentBlockEnloseContent';
import { tText } from '~shared/helpers/translation-functions';
import { compact } from 'lodash-es';
import Html from '~shared/components/Html/Html';
import { Link } from '~modules/shared/components/Link';

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
	const ieObjectsIds: (MappedObject | undefined)[] = useMemo(
		() =>
			compact(
				elements.map((element) => {
					if (!element?.mediaItem?.value) {
						return;
					}
					console.log('we here');
					return {
						value: element.mediaItem.value,
						type: element.mediaItem.type,
					};
				})
			),
		[elements]
	);

	const enclosedContent = useGetContentBlockEnloseContent(
		ieObjectsIds as MappedObject[],
		elements
	);

	return (
		<section>
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
				{enclosedContent?.map((object: any) => {
					return (
						<li className="c-block-enclosed-content__cards__card" key={object?.id}>
							<Link to="#">
								<div
									className="c-block-enclosed-content__cards__card__image"
									style={{
										backgroundImage: `url( ${object?.thumbnail} )`,
									}}
								>
									{object?.thumbnail
										? null
										: tText('Je hebt geen toegang tot deze content')}
									<div className="c-block-enclosed-content__cards__card__image__icon">
										<Icon name={'filter'} />
									</div>
								</div>
								<div className="c-block-enclosed-content__cards__card__wrapper">
									<span className="c-block-enclosed-content__cards__card__title">
										{object?.name || tText('Deze content bestaat niet meer')}
									</span>
									<div className="c-block-enclosed-content__cards__card__description-wrapper">
										<Html
											content={object?.description}
											className="c-block-enclosed-content__cards__card__description"
										/>
									</div>
								</div>
								{object?.type === 'OBJECT' ? (
									<div className={'c-block-enclosed-content__cards__card__meta'}>
										<div className="c-block-enclosed-content__cards__card__meta__maintainer">
											{object?.maintainerName}
										</div>
										<div className="c-block-enclosed-content__cards__card__meta__date">
											{object?.dateCreated}
										</div>
										<div>{object?.id}</div>
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
