import { ButtonAction } from '@viaa/avo2-components';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { FunctionComponent, ReactElement, ReactNode } from 'react';
import SmartLink from '~modules/shared/components/SmartLink/SmartLink';
import { DefaultComponentProps } from '~modules/shared/types/components';

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
}): ReactElement => (
	<div className={classnames('c-block-tags-with-link', className)}>
		{elements.map(
			({ link, label }: BlockTagWithLinkProps, i: number): ReactNode =>
				!isNil(link) ? (
					<SmartLink
						className="c-block-tags-with-link__term"
						key={`c-block-tags-with-link-${i}`}
						action={link}
					>
						{label}
					</SmartLink>
				) : (
					<p key={`c-block-tags-with-link-${i}`} className="c-block-tags-with-link__term">
						{label}
					</p>
				)
		)}
	</div>
);
