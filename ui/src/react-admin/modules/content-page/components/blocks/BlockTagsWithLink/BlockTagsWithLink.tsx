import type { ButtonAction } from '@viaa/avo2-components';
import clsx from 'clsx';
import { isEmpty, isNil } from 'lodash-es';
import type { FunctionComponent, ReactElement, ReactNode } from 'react';
import SmartLink from '~modules/shared/components/SmartLink/SmartLink';
import type { DefaultComponentProps } from '~modules/shared/types/components';

export interface BlockTagWithLinkProps {
	label: string;
	link?: ButtonAction;
}

export interface BlockTagsWithLinkProps extends DefaultComponentProps {
	elements: BlockTagWithLinkProps[];
}

export const BlockTagsWithLink: FunctionComponent<BlockTagsWithLinkProps> = ({
	className,
	elements,
}): ReactElement => {
	const renderTag = (link: ButtonAction | undefined, label: string, i: number): ReactElement =>
		!isNil(link) ? (
			<SmartLink
				key={`c-block-tags-with-link-${i}`}
				className="c-block-tags-with-link__term c-block-tags-with-link__link"
				action={link}
			>
				{label}
			</SmartLink>
		) : (
			<p key={`c-block-tags-with-link-${i}`} className="c-block-tags-with-link__term">
				{label}
			</p>
		);

	return (
		<div className={clsx('c-block-tags-with-link', className)}>
			{elements.map(
				({ link, label }: BlockTagWithLinkProps, i: number): ReactNode =>
					!isNil(label) && !isEmpty(label) ? renderTag(link, label, i) : null
			)}
		</div>
	);
};
