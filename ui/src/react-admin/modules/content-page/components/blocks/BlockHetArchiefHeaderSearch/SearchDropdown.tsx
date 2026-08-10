import {
	Dropdown,
	DropdownButton,
	DropdownContent,
	keysEnter,
	keysSpacebar,
	onKey,
} from '@meemoo/react-components';
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

const DROPDOWN_ID = 'search-dropdown-options';

export const SearchDropdown: FC<SearchDropdownProps> = ({
	options,
	selectedOptionId,
	onSelectOption,
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleSelectOption = (selectedOption: SearchDropdownOption): void => {
		setIsOpen(false);
		onSelectOption(selectedOption);
	};

	const selected = options.find(({ id }: SearchDropdownOption) => id === selectedOptionId);

	return (
		<Dropdown
			id={DROPDOWN_ID}
			isOpen={isOpen}
			onOpen={() => setIsOpen(true)}
			onClose={() => setIsOpen(false)}
			menuClassName="c-search-dropdown"
			triggerClassName="c-search-dropdown__trigger"
			flyoutClassName="c-search-dropdown__flyout"
			menuWidth="fit-trigger"
			placement="bottom-start"
			offset={0}
		>
			<DropdownButton>
				<button
					type="button"
					className={clsx('c-search-dropdown__active', {
						'c-search-dropdown__active--open': isOpen,
					})}
					aria-expanded={isOpen}
					aria-controls={DROPDOWN_ID}
				>
					<div className="c-search-dropdown__active-content">
						<p className="c-search-dropdown__active-label">{selected?.selectedLabel}</p>
					</div>
					<Icon
						className={clsx('c-search-dropdown__active-icon', {
							'c-search-dropdown__active-icon--open': isOpen,
						})}
						name="angleDown"
					/>
				</button>
			</DropdownButton>
			<DropdownContent>
				{/* biome-ignore lint/a11y/useSemanticElements: Dropdown options */}
				{/* biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: Dropdown options */}
				<ul className="u-list-reset c-search-dropdown__list" role="listbox">
					{options.map((option: SearchDropdownOption) => (
						<li
							key={option.id}
							// biome-ignore lint/a11y/useSemanticElements: Dropdown options
							// biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: Dropdown options
							role="option"
							tabIndex={isOpen ? 0 : -1}
							aria-selected={selectedOptionId === option.id}
							onClick={() => handleSelectOption(option)}
							onKeyDown={(e) =>
								onKey(e, [...keysEnter, ...keysSpacebar], () => {
									if (keysSpacebar.includes(e.key)) {
										e.preventDefault();
									}
									handleSelectOption(option);
								})
							}
							className="c-search-dropdown__option"
						>
							<p className="c-search-dropdown__option-label u-text-ellipsis">{option.label}</p>
						</li>
					))}
				</ul>
			</DropdownContent>
		</Dropdown>
	);
};
