import { keysEnter, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { Icon } from '~shared/components/Icon/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';

interface SearchDropdownOption {
	id: string;
	label: string;
	selectedLabel: string;
}

export const SearchDropdown: FC = () => {
	const SEARCH_OPTIONS: SearchDropdownOption[] = [
		{
			id: 'search-all',
			selectedLabel: tText('Alles'),
			label: tText('Zoek in alle objecten'),
		},
		{
			id: 'search-audio',
			selectedLabel: tText('Alle audio'),
			label: tText('Zoek in audio'),
		},
		{
			id: 'search-video',
			selectedLabel: tText('Alle video'),
			label: tText('Zoek in video'),
		},
		{
			id: 'search-newspapers',
			selectedLabel: tText('Alle kranten'),
			label: tText('Zoek in kranten'),
		},
	];

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedOptionId, setSelectedOptionId] = useState<string>(SEARCH_OPTIONS[0].id);

	const onClickDropdown = (): void => {
		setIsOpen((prevIsOpen: boolean) => !prevIsOpen);
	};

	const onSelectOption = (selectedOption: SearchDropdownOption): void => {
		setIsOpen(false);
		setSelectedOptionId(selectedOption.id);
	};

	const renderSelectedOption = () => {
		const selected = SEARCH_OPTIONS.find(({ id }: SearchDropdownOption) => id === selectedOptionId);

		const actionProps = {
			tabIndex: 0,
			role: 'button',
			'aria-expanded': isOpen,
			'aria-controls': 'list-controls',
			onClick: onClickDropdown,
			// biome-ignore lint/suspicious/noExplicitAny: No typing yet
			onKeyDown: (evt: any) => onKey(evt, [...keysEnter], onClickDropdown),
		};

		return (
			<li {...actionProps} className="c-search-dropdown__active">
				<div className="c-search-dropdown__active-content">
					<p className="c-search-dropdown__active-label">{selected?.selectedLabel}</p>
				</div>
				<Icon className="c-search-dropdown__active-icon" name="angleDown" />
			</li>
		);
	};

	const renderAllOptions = () => (
		<li aria-hidden={!isOpen} id="list-controls">
			<ul
				className={clsx('u-list-reset', 'c-search-dropdown__list', {
					'c-search-dropdown__list--open': isOpen,
				})}
			>
				{SEARCH_OPTIONS.map((option: SearchDropdownOption) => (
					// biome-ignore lint/a11y/useAriaPropsSupportedByRole: because it works?
					<li
						tabIndex={isOpen ? 0 : 1}
						key={option.id}
						aria-selected={selectedOptionId === option.id}
						onClick={() => onSelectOption(option)}
						onKeyDown={(e) => onKey(e, [...keysEnter], () => onSelectOption(option))}
						className="c-search-dropdown__option"
					>
						<p className="c-search-dropdown__option-label u-text-ellipsis">{option.label}</p>
					</li>
				))}
			</ul>
		</li>
	);

	return (
		<ul
			className={clsx('u-list-reset', 'c-search-dropdown', 'c-search-dropdown--selectable', {
				'c-search-dropdown--open': isOpen,
			})}
		>
			{renderSelectedOption()}
			{renderAllOptions()}
		</ul>
	);
};
