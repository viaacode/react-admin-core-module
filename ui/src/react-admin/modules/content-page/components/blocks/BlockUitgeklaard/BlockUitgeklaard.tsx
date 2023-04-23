import { DefaultProps } from '@viaa/avo2-components';
import classnames from 'classnames';
import { format, parseISO } from 'date-fns';
import React, { FunctionComponent } from 'react';

import './BlockUitgeklaard.scss';

export interface BlockUitgeklaardProps extends DefaultProps {
	className?: string;
	date: string;
	titles: string[];
}

export const BlockUitgeklaard: FunctionComponent<BlockUitgeklaardProps> = ({
	className,
	date,
	titles,
}) => (
	<div className={classnames(className, 'uitgeklaard-header')} role="banner">
		<div className="uitgeklaard-header__logo">
			<span>Uitgeklaard</span>
		</div>
		{date && <div className="uitgeklaard-header__date">{format(parseISO(date), 'PP')}</div>}
		<div className="uitgeklaard-header__titles">{(titles || []).join(' • ')}</div>
	</div>
);
