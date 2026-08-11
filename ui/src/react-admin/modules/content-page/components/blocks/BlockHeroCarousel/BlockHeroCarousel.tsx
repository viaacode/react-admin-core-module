import { type ButtonAction, Image } from '@viaa/avo2-components';
import React, {
	type FunctionComponent,
	type KeyboardEvent,
	type ReactElement,
	type ReactNode,
	useEffect,
	useState,
} from 'react';
import type { Color, HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockHeroCarousel.scss';
import { Button, TextInput } from '@meemoo/react-components';
import type SwiperController from 'swiper';
import { Controller } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';
import 'swiper/css';
import clsx from 'clsx';
import { stringifyUrl } from 'query-string';
import { BlockHeading } from '~content-blocks/BlockHeading';
import {
	SearchDropdown,
	type SearchDropdownOption,
} from '~content-blocks/BlockHeroCarousel/SearchDropdown.tsx';
import { AdminConfigManager } from '~core/config';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink.tsx';
import { navigateFunc } from '~shared/helpers/navigate-fnc.ts';
import { HET_ARCHIEF } from '~shared/types';

export interface BlockHeroCarouselProps extends DefaultComponentProps {
	title: string;
	searchAriaLabel: string;
	subtitles: { label: string }[];
	elements: {
		mediaItem?: ButtonAction;
		image: string;
		imageAlt: string;
		title: string;
		textColor: Color;
		backgroundColor: Color;
		itemDisplay: string;
	}[];
}

export const BlockHeroCarousel: FunctionComponent<BlockHeroCarouselProps> = ({
	className,
	title,
	subtitles,
	searchAriaLabel,
	elements,
}): ReactNode => {
	const SEARCH_OPTIONS: SearchDropdownOption[] = [
		{
			id: 'all',
			selectedLabel: tText('Alles'),
			label: tText('Zoek in alle objecten'),
		},
		{
			id: 'video',
			selectedLabel: tText('Alle video'),
			label: tText('Zoek in video'),
		},
		{
			id: 'audio',
			selectedLabel: tText('Alle audio'),
			label: tText('Zoek in audio'),
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
		const baseQuery = {
			format: mediaType,
		};
		const url = stringifyUrl({
			url: AdminConfigManager.getConfig().routes.SEARCH || '/zoeken',
			query: searchTerm
				? {
						...baseQuery,
						zoekterm: searchTerm,
					}
				: baseQuery,
		});
		await navigateFunc(url);
	};

	return (
		<article className={clsx('c-block-hero-carousel', className)}>
			<div className="c-block-hero-carousel__header">
				<BlockHeading className="c-block-hero-carousel__title" type="h1">
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
					className={clsx(
						'c-block-hero-carousel__searchbar',
						'c-block-hero-carousel__searchbar--has-dropdown'
					)}
				>
					<SearchDropdown
						options={SEARCH_OPTIONS}
						selectedOptionId={mediaType}
						onSelectOption={(selectedOption) => setMediaType(selectedOption.id)}
					/>
					<TextInput
						id="block-hetarchief-header-search__search-input"
						ariaLabel={searchAriaLabel}
						placeholder={tText(
							'react-admin/modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___start-je-zoektocht',
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
									'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___zoek-in-de-publieke-catalogus-input-aria-label',
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
			</div>
		</article>
	);
};
