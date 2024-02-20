import { DefaultProps } from '@viaa/avo2-components';
import clsx from 'clsx';
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
	<div className={clsx(className, 'uitgeklaard-header')} role="banner">
		<div className="uitgeklaard-header__logo">
			<span>Uitgeklaard</span>
		</div>
		{date && <div className="uitgeklaard-header__date">{format(parseISO(date), 'PPP')}</div>}
		<div className="uitgeklaard-header__titles">{(titles || []).join(' • ')}</div>
	</div>
);
