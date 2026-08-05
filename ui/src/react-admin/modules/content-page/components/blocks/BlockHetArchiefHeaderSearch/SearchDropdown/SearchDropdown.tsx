import { keysEnter, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { tText } from '~shared/helpers/translation-functions.ts';
import styles from './SearchDropdown.module.scss';

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
			<li {...actionProps} className={clsx(styles['c-visitor-spaces-dropdown__active'])}>
				<div className={clsx(styles['c-visitor-spaces-dropdown__active-content'])}>
					<p className={clsx(styles['c-visitor-spaces-dropdown__active-label'])}>
						{selected?.selectedLabel}
					</p>
				</div>
			</li>
		);
	};

	const renderAllOptions = () => (
		<li aria-hidden={!isOpen} id="list-controls">
			<ul
				className={clsx('u-list-reset', styles['c-visitor-spaces-dropdown__list'], {
					[styles['c-visitor-spaces-dropdown__list--open']]: isOpen,
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
						className={clsx(styles['c-visitor-spaces-dropdown__option'])}
					>
						<p
							className={clsx(styles['c-visitor-spaces-dropdown__option-label'], 'u-text-ellipsis')}
						>
							{option.label}
						</p>
					</li>
				))}
			</ul>
		</li>
	);

	return (
		<ul
			className={clsx('u-list-reset', styles['c-visitor-spaces-dropdown'], {
				[styles['c-visitor-spaces-dropdown--open']]: isOpen,
				[styles['c-visitor-spaces-dropdown--selectable']]: true,
			})}
		>
			{renderSelectedOption()}
			{renderAllOptions()}
		</ul>
	);
};
