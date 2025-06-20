import type { DefaultProps } from "@viaa/avo2-components";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import nlBE from "date-fns/locale/nl-BE/index.js";
import type { FunctionComponent } from "react";
import React from "react";

import "./BlockKlaar.scss";

export interface BlockKlaarProps extends DefaultProps {
	className?: string;
	date: string;
	titles: string[];
}

export const BlockKlaar: FunctionComponent<BlockKlaarProps> = ({
	className,
	date,
	titles,
}) => (
	// biome-ignore lint/a11y/useSemanticElements: we're keeping div + role banner to not affect any css selectors
	<div className={clsx(className, "klaar-header")} role="banner">
		<div className="klaar-header__logo">
			<span>KLAAR</span>
		</div>
		{date && (
			<div className="klaar-header__date">
				{format(parseISO(date), "PPP", { locale: nlBE })}
			</div>
		)}
		<div className="klaar-header__titles">{(titles || []).join(" • ")}</div>
	</div>
);
