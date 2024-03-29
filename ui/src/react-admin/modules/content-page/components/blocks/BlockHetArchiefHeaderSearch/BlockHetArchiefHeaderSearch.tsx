import { TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { stringifyUrl } from 'query-string';
import React, { FunctionComponent, KeyboardEvent, ReactElement, useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components';
import { KeyCode } from '~shared/consts/keycode';
import { useTranslation } from '~shared/hooks/useTranslation';
import { BlockHeading } from '../BlockHeading';

export interface BlockHetArchiefHeaderSearchProps extends DefaultComponentProps {
	title: string;
	subtitles: { label: string }[];
	textBelowSearch?: string;
}

export const BlockHetArchiefHeaderSearch: FunctionComponent<BlockHetArchiefHeaderSearchProps> = ({
	className,
	title,
	subtitles,
	textBelowSearch,
}): ReactElement => {
	const { tText } = useTranslation();
	const [activeIndex, setActiveIndex] = useState<number>(subtitles.length - 1);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const history = AdminConfigManager.getConfig().services.router.useHistory();

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
			query: { zoekterm: searchTerm },
		});
		history.push(url);
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
									next:
										activeIndex ===
										(index - 1 + subtitles.length) % subtitles.length,
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
					placeholder={tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___start-je-zoektocht'
					)}
					iconEnd={
						<div onClick={navigateToSearchPage}>
							<Icon name="filter" />
						</div>
					}
					onChange={(evt) => setSearchTerm(evt.target.value)}
					onKeyUp={handleKeyUp as any}
					value={searchTerm}
				/>
				<p>{textBelowSearch}</p>
			</div>
		</article>
	);
};
