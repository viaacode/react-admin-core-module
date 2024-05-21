import React, { FC, useEffect } from 'react';
import { BlockHeading } from '~content-blocks/BlockHeading';
import SmartLink, { generateSmartLink } from '~shared/components/SmartLink/SmartLink';
import { Button } from '@viaa/avo2-components';
import { Icon } from '~shared/components';

export const BlockContentEnclose: FC<any> = ({
	title,
	titleType,
	description,
	buttonLabel,
	buttonAction,
	buttonType,
	buttonIcon,
	buttonAltTitle,
	objects,
}) => {
	useEffect(() => {
		console.log(objects);
	}, [objects]);
	return (
		<article>
			<div className="c-block-maintainers-grid__header">
				<div>
					<BlockHeading className="c-block-maintainers-grid__title" type={titleType}>
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
		</article>
	);
};
