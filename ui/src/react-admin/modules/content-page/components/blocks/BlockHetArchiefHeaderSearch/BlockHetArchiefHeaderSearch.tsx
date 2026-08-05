import { TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { stringifyUrl } from 'query-string';
import React, {
	type FunctionComponent,
	type KeyboardEvent,
	type ReactElement,
	useEffect,
	useState,
} from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon/Icon';
import { navigateFunc } from '~shared/helpers/navigate-fnc';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import { BlockHeading } from '../BlockHeading/BlockHeading';
import { useHasAccessToVisitorSpaces } from './hooks/has-access-to-visitor-spaces.ts';
import { SearchDropdown, type SearchDropdownOption } from './SearchDropdown.tsx';

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
	const SEARCH_OPTIONS: SearchDropdownOption[] = [
		{
			id: 'all',
			selectedLabel: tText('Alles'),
			label: tText('Zoek in alle objecten'),
		},
		{
			id: 'audio',
			selectedLabel: tText('Alle audio'),
			label: tText('Zoek in audio'),
		},
		{
			id: 'video',
			selectedLabel: tText('Alle video'),
			label: tText('Zoek in video'),
		},
		{
			id: 'newspaper',
			selectedLabel: tText('Alle kranten'),
			label: tText('Zoek in kranten'),
		},
	];

	const [activeIndex, setActiveIndex] = useState<number>(subtitles.length - 1);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [mediaType, setMediaType] = useState<string>(SEARCH_OPTIONS[0].id);

	const { data: hasAccessToVisitorSpaces } = useHasAccessToVisitorSpaces();

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

	const navigateToSearchPage = async () => {
		const url = stringifyUrl({
			url: AdminConfigManager.getConfig().routes.SEARCH || '/zoeken',
			query: searchTerm
				? {
						zoekterm: searchTerm,
						format: mediaType,
					}
				: {},
		});
		await navigateFunc(url);
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
				<div
					className={clsx('c-block-het-archief-header-search__searchbar', {
						'c-block-het-archief-header-search__searchbar--has-dropdown': hasAccessToVisitorSpaces,
					})}
				>
					{hasAccessToVisitorSpaces && (
						<SearchDropdown
							options={SEARCH_OPTIONS}
							selectedOptionId={mediaType}
							onSelectOption={(selectedOption) => setMediaType(selectedOption.id)}
						/>
					)}
					<TextInput
						id="block-hetarchief-header-search__search-input"
						ariaLabel={searchAriaLabel}
						placeholder={tText(
							'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___start-je-zoektocht',
							{},
							[HET_ARCHIEF]
						)}
						iconEnd={
							<button
								onClick={navigateToSearchPage}
								onKeyUp={async (evt: KeyboardEvent) => {
									if (evt.key === 'Enter') {
										await navigateToSearchPage();
									}
								}}
								type="submit"
								aria-label={tText(
									'modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___zoek-in-de-publieke-catalogus-input-aria-label',
									{},
									[HET_ARCHIEF]
								)}
							>
								<Icon name="filter" />
							</button>
						}
						onChange={(evt) => setSearchTerm(evt.target.value)}
						onEnter={navigateToSearchPage}
						value={searchTerm}
					/>
				</div>
				{textBelowSearch && <p>{textBelowSearch}</p>}
			</div>
		</article>
	);
};
