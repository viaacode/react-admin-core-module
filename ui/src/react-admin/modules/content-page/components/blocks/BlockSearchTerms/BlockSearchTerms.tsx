import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { FunctionComponent, ReactElement, ReactNode } from 'react';
import { DefaultComponentProps } from '~modules/shared/types/components';

export interface BlockSearchTermProps {
	label: string;
	link?: string;
}

export interface BlockSearchTermsProps extends DefaultComponentProps {
	elements: BlockSearchTermProps[];
}

export const BlockSearchTerms: FunctionComponent<BlockSearchTermsProps> = ({
	className,
	elements,
}): ReactElement => (
	<div className={classnames('c-block-search-terms', className)}>
		{elements.map(
			({ link, label }: BlockSearchTermProps): ReactNode =>
				!isNil(link) ? (
					<a
						className="c-block-search-terms__term c-block-search-terms__link"
						href={link}
					>
						{label}
					</a>
				) : (
					<p className="c-block-search-terms__term c-block-search-terms__label">
						{label}
					</p>
				)
		)}
	</div>
);
