import React, { FunctionComponent, useState } from 'react';

import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
	MenuItemInfo,
} from '@meemoo/react-components';

import { Icon } from '../Icon';

export interface ActionsDropdownProps {
	menuItems: MenuItemInfo[] | MenuItemInfo[][];
	onOptionClicked: (menuItemId: string | number) => void;
}

const ActionsDropdown: FunctionComponent<ActionsDropdownProps> = ({
	menuItems,
	onOptionClicked,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleOptionClicked = (menuItemId: string | number) => {
		setIsOpen(false);
		onOptionClicked(menuItemId);
	};

	return !!menuItems && !!menuItems.length ? (
		<Dropdown
			className="c-actions-dropdown"
			flyoutClassName="c-actions-dropdown-flyout"
			isOpen={isOpen}
			menuWidth="fit-content"
			onOpen={() => setIsOpen(true)}
			onClose={() => setIsOpen(false)}
			placement="bottom-end"
		>
			<DropdownButton>
				<Button>
					<Icon name="extraOptions" />
				</Button>
			</DropdownButton>
			<DropdownContent>
				<MenuContent menuItems={menuItems} onClick={handleOptionClicked} />
			</DropdownContent>
		</Dropdown>
	) : null;
};

export default ActionsDropdown;
