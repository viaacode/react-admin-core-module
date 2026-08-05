import { keysEnter, onKey } from '@meemoo/react-components';
import clsx from 'clsx';
import { type FC, useState } from 'react';
import { Icon } from '~shared/components/Icon/Icon';

export interface SearchDropdownOption {
	id: string;
	label: string;
	selectedLabel: string;
}

interface SearchDropdownProps {
	options: SearchDropdownOption[];
	selectedOptionId: string;
	onSelectOption: (selectedOption: SearchDropdownOption) => void;
}

export const SearchDropdown: FC<SearchDropdownProps> = ({
	options,
	selectedOptionId,
	onSelectOption,
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onClickDropdown = (): void => {
		setIsOpen((prevIsOpen: boolean) => !prevIsOpen);
	};

	const handleSelectOption = (selectedOption: SearchDropdownOption): void => {
		setIsOpen(false);
		onSelectOption(selectedOption);
	};

	const renderSelectedOption = () => {
		const selected = options.find(({ id }: SearchDropdownOption) => id === selectedOptionId);

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
				{options.map((option: SearchDropdownOption) => (
					// biome-ignore lint/a11y/useAriaPropsSupportedByRole: because it works?
					<li
						tabIndex={isOpen ? -1 : 1}
						key={option.id}
						aria-selected={selectedOptionId === option.id}
						onClick={() => handleSelectOption(option)}
						onKeyDown={(e) => onKey(e, [...keysEnter], () => handleSelectOption(option))}
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
