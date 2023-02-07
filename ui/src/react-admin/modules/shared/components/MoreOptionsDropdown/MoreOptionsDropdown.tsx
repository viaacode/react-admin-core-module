import React, { FunctionComponent } from 'react';

import { useTranslation } from '~shared/hooks/useTranslation';

import {
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	IconName,
	MenuContent,
	MenuItemInfo,
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
	const { tText } = useTranslation();

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
					icon={IconName.moreHorizontal}
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
