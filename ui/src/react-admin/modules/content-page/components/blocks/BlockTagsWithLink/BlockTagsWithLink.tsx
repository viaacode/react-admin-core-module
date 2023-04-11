import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { FunctionComponent, ReactElement, ReactNode } from 'react';
import { DefaultComponentProps } from '~modules/shared/types/components';

export interface BlockTagWithLinkProps {
	label: string;
	link?: string;
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
			({ link, label }: BlockTagWithLinkProps): ReactNode =>
				!isNil(link) ? (
					<a
						className="c-block-tags-with-link__term c-block-tags-with-link__link"
						href={link}
					>
						{label}
					</a>
				) : (
					<p className="c-block-tags-with-link__term c-block-tags-with-link__label">
						{label}
					</p>
				)
		)}
	</div>
);
