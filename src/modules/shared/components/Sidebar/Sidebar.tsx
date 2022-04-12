import clsx from 'clsx';
import { Location } from 'history';
import { flatten } from 'lodash-es';
import React, { FunctionComponent, ReactElement } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

import './Sidebar.scss';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { NavigationItemInfo } from '../../../shared/types';

interface SidebarProps {
	className?: string;
	headerLink?: string;
	light?: boolean;
	navItems?: NavigationItemInfo[];
}

export const Sidebar: FunctionComponent<SidebarProps> = ({
	children,
	className,
	headerLink,
	light = false,
	navItems,
}) => {
	const { t } = useTranslation();

	const isActiveClass = (item: NavigationItemInfo, location: Location): boolean => {
		return (
			(!!item.location && item.location === location.pathname && !item.exact) ||
			(!!item.location &&
				item.location === location.pathname + location.search &&
				!!item.exact)
		);
	};

	const renderNavigationItem = (
		navItem: NavigationItemInfo,
		index: number | string,
		isSubLink: boolean
	): ReactElement => {
		if (!navItem.location) {
			console.error(
				new CustomError(
					'Failed to correctly render navigation item because location is undefined',
					null,
					{ navItem, index, isSubLink }
				)
			);
		}
		return (
			<li
				key={`${navItem.location}-${index}`}
				className={clsx('o-sidebar__nav-item-wrapper', {
					'o-sidebar__nav-item-sublink': isSubLink || false,
				})}
			>
				<NavLink
					className={clsx('o-sidebar__nav-item')}
					activeClassName="o-sidebar__nav-item--active"
					isActive={(_match, location) => isActiveClass(navItem, location)}
					to={navItem.location || '/'}
				>
					{navItem.label}
				</NavLink>
			</li>
		);
	};

	const renderNavItems = () => {
		const renderedNavItems: ReactElement[] = flatten(
			(navItems || []).map((navItem, itemIndex): ReactElement[] => [
				renderNavigationItem(navItem, itemIndex, false),
				...(navItem.subLinks || []).map((subLinkItem: NavigationItemInfo, subItemIndex) => {
					return renderNavigationItem(subLinkItem, `${itemIndex}-${subItemIndex}`, true);
				}),
			])
		);
		return <>{renderedNavItems}</>;
	};

	return (
		<div className={clsx(className, 'o-sidebar', { 'o-sidebar--light': light })}>
			{headerLink && (
				<div className="o-sidebar__header">
					<Link className="u-remove-link-styling u-color-white" to={headerLink}>
						{t("admin/shared/components/sidebar/sidebar___beheer")}
					</Link>
				</div>
			)}
			<div className="o-sidebar__content">
				{navItems ? (
					<ul className="o-sidebar__nav c-bordered-list">{renderNavItems()}</ul>
				) : (
					children
				)}
			</div>
		</div>
	);
};
