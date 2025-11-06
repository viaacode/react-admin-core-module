import { TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { stringifyUrl } from 'query-string';
import type { FunctionComponent, KeyboardEvent, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config/config.class.js';
import type { DefaultComponentProps } from '~modules/shared/types/components.js';
import { Icon } from '~shared/components/Icon/Icon.js';
import { KeyCode } from '~shared/consts/keycode.js';
import { tText } from '~shared/helpers/translation-functions.js';
import { BlockHeading } from '../BlockHeading/BlockHeading.js';

export interface BlockHetArchiefHeaderSearchProps extends DefaultComponentProps {
	title: string;
	searchAriaLabel: string;
	subtitles: { label: string }[];
	textBelowSearch?: string;
}

export const BlockHetArchiefHeaderSearch: FunctionComponent<BlockHetArchiefHeaderSearchProps> = ({
	className,
	title,
	subtitles,
	searchAriaLabel,
	textBelowSearch,
}): ReactElement => {
	const [activeIndex, setActiveIndex] = useState<number>(subtitles.length - 1);
	const [searchTerm, setSearchTerm] = useState<string>('');

	useEffect(() => {
		const timerId = setInterval(() => {
			// setActive(activeIndex);
			setActiveIndex((oldActiveIndex) => (oldActiveIndex + 1) % subtitles.length);
		}, 3000);

		return () => {
			if (timerId) {
				clearInterval(timerId);
			}
		};
	}, [subtitles.length]);

	const navigateToSearchPage = () => {
		const url = stringifyUrl({
			url: AdminConfigManager.getConfig().routes.SEARCH || '/zoeken',
			query: searchTerm ? { zoekterm: searchTerm } : {},
		});
		// biome-ignore lint/correctness/useHookAtTopLevel: This isn't a hook, but a function in the admin core config
		AdminConfigManager.getConfig().services.router.navigateFunc(url);
	};

	const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === KeyCode.Enter) {
			navigateToSearchPage();
		}
	};

	return (
		<article className={clsx('c-block-het-archief-header-search', className)}>
			<div className="c-block-het-archief-header-search__header">
				<BlockHeading className="c-block-het-archief-header-search__title" type="h1">
					{title}
				</BlockHeading>
				{subtitles?.length && (
					<ul>
						{/* Add first item again at the end for a smooth crossfade animation */}
						{subtitles.map((subtitle, index) => (
							<li
								key={`animation-text-${subtitle.label}-${index}`}
								className={clsx({
									current: activeIndex === index,
									next: activeIndex === (index - 1 + subtitles.length) % subtitles.length,
								})}
							>
								{subtitle.label}
							</li>
						))}
					</ul>
				)}
			</div>
			<div>
				<TextInput
					aria-label={searchAriaLabel}
					placeholder={tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___start-je-zoektocht'
					)}
					iconEnd={
						<div
							onClick={navigateToSearchPage}
							onKeyUp={(evt: KeyboardEvent) => {
								if (evt.key === 'Enter') {
									navigateToSearchPage();
								}
							}}
						>
							<Icon name="filter" />
						</div>
					}
					onChange={(evt) => setSearchTerm(evt.target.value)}
					// biome-ignore lint/suspicious/noExplicitAny: todo
					onKeyUp={handleKeyUp as any}
					value={searchTerm}
				/>
				<p>{textBelowSearch}</p>
			</div>
		</article>
	);
};
