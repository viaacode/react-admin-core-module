import { Row, Table, TableOptions } from '@meemoo/react-components';
import { FunctionComponent, ReactNode, useCallback, useEffect, useState } from 'react';
import { Icon } from '~modules/shared/components';
import Html from '~modules/shared/components/Html/Html';
import { formatDate } from '~modules/shared/helpers/formatters/date';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { AlertsService } from '../alerts.service';
import { Alert, AlertsOverviewProps } from '../alerts.types';

const AlertsOverview: FunctionComponent<AlertsOverviewProps> = ({ className, renderPopup }) => {
	const { tText, tHtml } = useTranslation();
	const [alerts, setAlerts] = useState<any>();

	const getAlerts = useCallback(async () => {
		const allAlerts = await AlertsService.fetchAlerts();
		setAlerts(allAlerts);
	}, [setAlerts]);

	useEffect(() => {
		getAlerts();
	}, []);

	useEffect(() => {
		console.log(alerts);
	}, [alerts]);

	const renderAlertsTable = (): ReactNode => {
		return (
			<>
				<Table
					options={
						{
							columns: [
								{
									id: 'title',
									Header: tHtml(
										'modules/alerts/views/alerts-overview___titel-melding'
									),
									accessor: 'title',
									Cell: ({ row }: { row: Row<Alert> }) => {
										return (
											<Html
												content={row.original.title}
												className="c-content"
											></Html>
										);
									},
								},
								{
									id: 'visibleFrom',
									Header: tHtml(
										'modules/alerts/views/alerts-overview___zichtbaar-van'
									),
									accessor: 'visibleFrom',
									Cell: () => {
										return <div>test</div>;
									},
								},
								{
									id: 'visibleUntil',
									Header: tHtml(
										'modules/alerts/views/alerts-overview___zichtbaar-tot'
									),
									accessor: 'visibleUntil',
									Cell: () => {
										return <Html content={formatDate(new Date())}></Html>;
									},
								},
								{
									id: 'status',
									Header: tHtml('modules/alerts/views/alerts-overview___status'),
									accessor: 'status',
									Cell: () => {
										return <div>test</div>;
									},
								},
								{
									id: 'edit',
									Header: '',
									Cell: () => {
										return <Icon name="edit"></Icon>;
									},
								},
							],
							data: [
								{
									title: 'test-title3',
								},
								{
									title: 'test-title2',
								},
							],
							initialState: {
								pageSize: 20,
							},
						} as TableOptions<any>
					}
				/>
			</>
		);
	};

	return <div className={className}>{renderAlertsTable()}</div>;
};

export default AlertsOverview as FunctionComponent<AlertsOverviewProps>;
