import type { FunctionComponent } from 'react';
import React from 'react';

import { tText } from '~shared/helpers/translation-functions.js';

import type { IconName, MenuItemInfo } from '@viaa/avo2-components';
import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
} from '@viaa/avo2-components';

export interface MoreOptionsDropdownProps {
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	menuItems: MenuItemInfo[] | MenuItemInfo[][];
	onOptionClicked: (menuItemId: string | number) => void;
}

const MoreOptionsDropdown: FunctionComponent<MoreOptionsDropdownProps> = ({
	isOpen,
	onOpen,
	onClose,
	menuItems,
	onOptionClicked,
}) => {
	return !!menuItems && !!menuItems.length ? (
		<Dropdown
			isOpen={isOpen}
			menuWidth="fit-content"
			onOpen={onOpen}
			onClose={onClose}
			placement="bottom-end"
		>
			<DropdownButton>
				<Button
					icon={'moreHorizontal' as IconName}
					type="secondary"
					ariaLabel={tText('assignment/views/assignment-detail___meer-opties')}
					title={tText('assignment/views/assignment-detail___meer-opties')}
				/>
			</DropdownButton>
			<DropdownContent>
				<MenuContent menuItems={menuItems} onClick={onOptionClicked} />
			</DropdownContent>
		</Dropdown>
	) : null;
};

export default MoreOptionsDropdown;
