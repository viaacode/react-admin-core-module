import { startCase } from 'lodash-es';
import React, { FunctionComponent, useState } from 'react';

import { Button, ButtonToolbar, Spacer, Table } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';

// import { DataQueryComponent } from '../../../shared/components';
import { GET_NAVIGATION_OVERVIEW_TABLE_COLS, NAVIGATION_PATH } from '../navigation.const';
import { GET_MENUS } from '../menu.gql';
import { NavigationOverviewTableCols } from '../navigation.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { Config } from '~core/config';
import { buildLink, navigate } from '~modules/shared/helpers/link';

const NavigationOverview: FunctionComponent = () => {
	const { t } = useTranslation();
	const Link = Config.getConfig().services.router.Link;
	const history = Config.getConfig().services.router.useHistory();

	const [menus, setMenus] = useState<any>([]);

	const renderTableCell = (rowData: Partial<Avo.Menu.Menu>, columnId: NavigationOverviewTableCols) => {
		const placement = rowData.placement || undefined;

		switch (columnId) {
			case 'placement':
				return (
					<Link to={buildLink(NAVIGATION_PATH.NAVIGATION_DETAIL, { menu: placement })}>
						{startCase(placement || '')}
					</Link>
				);
			case 'actions':
				return (
					<ButtonToolbar>
						<Button
							icon="eye"
							onClick={() =>
								navigate(history, NAVIGATION_PATH.NAVIGATION_DETAIL, { menu: placement })
							}
							size="small"
							title={t(
								'admin/menu/views/menu-overview___bekijk-de-navigatie-items-voor-deze-navigatie-balk'
							)}
							ariaLabel={t(
								'admin/menu/views/menu-overview___bekijk-de-navigatie-items-voor-deze-navigatie-balk'
							)}
							type="secondary"
						/>
						<Button
							icon="plus"
							onClick={() =>
								navigate(history, NAVIGATION_PATH.NAVIGATION_ITEM_CREATE, { menu: placement })
							}
							size="small"
							title={t(
								'admin/menu/views/menu-overview___voeg-een-navigatie-item-toe-aan-deze-navigatie-balk'
							)}
							ariaLabel={t(
								'admin/menu/views/menu-overview___voeg-een-navigatie-item-toe-aan-deze-navigatie-balk'
							)}
							type="secondary"
						/>
					</ButtonToolbar>
				);
			default:
				return rowData[columnId];
		}
	};

	const renderMenuOverview = (data: Partial<Avo.Menu.Menu>[]) => {
		if (!data.length) {
			return <>{t('admin/menu/views/menu-overview___beschrijving-hoe-navigatie-items-toe-te-voegen')}</>;
			// return (
			// 	<ErrorView
			// 		message={t(
			// 			'admin/menu/views/menu-overview___er-zijn-nog-geen-navigaties-aangemaakt'
			// 		)}
			// 	>
			// 		<p>
			// 			<>{t('admin/menu/views/menu-overview___beschrijving-hoe-navigatie-items-toe-te-voegen')}</>
			// 		</p>
			// 		<Spacer margin="top">
			// 			<Button
			// 				icon="plus"
			// 				label={t('admin/menu/views/menu-overview___navigatie-toevoegen')}
			// 				onClick={() => history.push(MENU_PATH.MENU_CREATE)}
			// 				type="primary"
			// 			/>
			// 		</Spacer>
			// 	</ErrorView>
			// );
		}

		setMenus(data);

		return (
			<Table
				columns={GET_NAVIGATION_OVERVIEW_TABLE_COLS()}
				data={data}
				renderCell={(rowData: Partial<Avo.Menu.Menu>, columnId: string) =>
					renderTableCell(rowData, columnId as NavigationOverviewTableCols)
				}
				rowKey="id"
				variant="bordered"
			/>
		);
	};

	return (
		// TODO demo page
		// <AdminLayout
		// 	pageTitle={t('admin/menu/views/menu-overview___navigatie-overzicht')}
		// 	size="large"
		// >
		// 	{!!menus.length && (
		// 		<AdminLayoutTopBarRight>
		// 			<Button
		// 				label={t('admin/menu/views/menu-overview___navigatie-toevoegen')}
		// 				onClick={() => history.push(MENU_PATH.MENU_CREATE)}
		// 			/>
		// 		</AdminLayoutTopBarRight>
		// 	)}
		// 	<AdminLayoutBody>
				<DataQueryComponent
					renderData={renderMenuOverview}
					resultPath="app_content_nav_elements"
					query={GET_MENUS}
				/>
		// 	</AdminLayoutBody>
		// </AdminLayout>
	);
};

export default NavigationOverview;
