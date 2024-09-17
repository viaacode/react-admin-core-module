import type { FunctionComponent } from 'react';
import React, { useState } from 'react';

import type { MenuItemInfo } from '@meemoo/react-components';
import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
} from '@meemoo/react-components';

import { Icon } from '../Icon';
import { tText } from '~shared/helpers/translation-functions';

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
				<Button
					title={tText(
						'modules/shared/components/actions-dropdown/actions-dropdown___hover-opties'
					)}
				>
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
