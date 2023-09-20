import { DefaultProps } from '@viaa/avo2-components';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import nlBE from 'date-fns/locale/nl-BE/index.js';
import React, { FunctionComponent } from 'react';

import './BlockKlaar.scss';

export interface BlockKlaarProps extends DefaultProps {
	className?: string;
	date: string;
	titles: string[];
}

export const BlockKlaar: FunctionComponent<BlockKlaarProps> = ({ className, date, titles }) => (
	<div className={clsx(className, 'klaar-header')} role="banner">
		<div className="klaar-header__logo">
			<span>KLAAR</span>
		</div>
		{date && (
			<div className="klaar-header__date">
				{format(parseISO(date), 'PP', { locale: nlBE })}
			</div>
		)}
		<div className="klaar-header__titles">{(titles || []).join(' • ')}</div>
	</div>
);
