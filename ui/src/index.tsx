import { LinkInfo, ToastInfo } from '~core/config/config.types';
import React, { FunctionComponent, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { TOptions } from 'i18next';

import App from './App';
import i18n, { initI18n } from './shared/translations/i18n';
import { Link, useHistory } from 'react-router-dom';
import { DatabaseType } from '@viaa/avo2-types';
import { AdminConfig, AdminConfigManager } from '~core/config';
import { ContentPageInfo, ContentWidth } from '~modules/content-page/types/content-pages.types';
import Html from '~shared/components/Html/Html';
import { ROUTE_PARTS } from '~shared/consts/routes';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';
import { IconName } from '@viaa/avo2-components';
import { capitalize, lowerCase } from 'lodash-es';

const proxyUrl = 'http://localhost:3300';

const routerConfig: AdminConfig['services']['router'] = {
	Link: Link as FunctionComponent<LinkInfo>,
	useHistory: useHistory,
};

const DUMMY_EDUCATIONAL_ORGANISATIONS = [
	{
		organizationId: '50674',
		unitId: '50674-5-316',
		label: 'Academie de Kunstbrug Gent - Bargiekaai 1',
	},
	{
		organizationId: '50674',
		unitId: '50674-24-316',
		label: 'Academie de Kunstbrug Gent - Cataloniëstraat 1',
	},
	{
		organizationId: '50674',
		unitId: '50674-2-316',
		label: 'Academie de Kunstbrug Gent - Coupure Rechts 52',
	},
	{
		organizationId: '50674',
		unitId: '50674-4-316',
		label: 'Academie de Kunstbrug Gent - Ottogracht Kunstencampus 4',
	},
];

function setConfig() {
	// only used for starting admin-core separately
	AdminConfigManager.setConfig({
		contentPage: {
			availableContentBlocks: [
				ContentBlockType.Heading,
				ContentBlockType.Intro,
				ContentBlockType.RichText,
				ContentBlockType.RichTextTwoColumns,
				ContentBlockType.Buttons,
				ContentBlockType.Image,
				ContentBlockType.ImageGrid,
				ContentBlockType.PageOverview,
				ContentBlockType.UspGrid,
				ContentBlockType.Quote,
				ContentBlockType.Uitgeklaard,
				ContentBlockType.ImageTitleTextButton,
				ContentBlockType.ThreeClickableTiles,
				ContentBlockType.TagsWithLink,
				ContentBlockType.CardsWithoutDescription,
				ContentBlockType.ImageTextBackground,
				ContentBlockType.MaintainersGrid,
				ContentBlockType.HetArchiefHeaderSearch,
			],
			defaultPageWidth: ContentWidth.LARGE,
			onSaveContentPage: async (contentPageInfo: ContentPageInfo) => {
				console.info('event handler: onSaveContentPage', { contentPageInfo });
			},
		},
		navigationBars: {
			enableIcons: true,
			customNavigationElements: ['<PROFILE_DROPDOWN>', '<VISITOR_SPACES_DROPDOWN>'],
		},
		staticPages: [
			`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
			`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}`,
			`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}`,
			`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.users}`,
		],
		icon: {
			component: ({ name }: any) => <span>{name}</span>,
			componentProps: {
				add: { name: 'add' },
				view: { name: 'view' },
				angleDown: { name: 'down' },
				angleUp: { name: 'up' },
				angleLeft: { name: 'left' },
				angleRight: { name: 'right' },
				delete: { name: 'delete' },
				edit: { name: 'edit' },
				extraOptions: { name: 'dots-vertical' },
				copy: { name: 'copy' },
				filter: { name: 'filter' },
				arrowUp: { name: 'arrow-up' },
				sortTable: { name: 'sort-table' },
				arrowDown: { name: 'arrow-down' },
				arrowRight: { name: 'arrow-right' },
				chevronLeft: { name: 'chevron-left' },
				check: { name: 'check' },
				calendar: { name: 'calendar' },
				clock: { name: 'clock' },
				export: { name: 'export' },
				info: { name: 'info' },
			},
			list: (): { value: IconName; label: string }[] => {
				return Object.values(IconName).map((iconName: IconName) => ({
					value: iconName,
					label: capitalize(lowerCase(iconName)),
				}));
			},
			alerts: (): { key: string; value: IconName; label: string }[] => {
				return Object.keys(IconName).map((key: string) => ({
					key,
					value: IconName[key as keyof typeof IconName],
					label: capitalize(lowerCase(key)),
				}));
			},
		},
		components: {
			loader: {
				component: null,
			},
			buttonTypes: () => [
				// Het archief buttons
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('index___zilver'),
					value: 'content-page-button--silver',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'index___blauw-groen'
					),
					value: 'content-page-button--teal',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('index___wit'),
					value: 'content-page-button--white',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('index___zwart'),
					value: 'content-page-button--black',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('index___outline'),
					value: 'content-page-button--outline',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('index___tekst'),
					value: 'content-page-button--text',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('index___rood'),
					value: 'content-page-button--red',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('index___link'),
					value: 'content-page-button--link',
				},

				// Avo buttons
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___primair'
				// 	),
				// 	value: 'primary',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___secundair'
				// 	),
				// 	value: 'secondary',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___secundair-invers'
				// 	),
				// 	value: 'secondary-i',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___tertiair'
				// 	),
				// 	value: 'tertiary',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___randloos'
				// 	),
				// 	value: 'borderless',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___randloos-invers'
				// 	),
				// 	value: 'borderless-i',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___gevaar'
				// 	),
				// 	value: 'danger',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___gevaar-hover'
				// 	),
				// 	value: 'danger-hover',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___link'
				// 	),
				// 	value: 'link',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___link-inline'
				// 	),
				// 	value: 'inline-link',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___leerling-primair-geel'
				// 	),
				// 	value: 'pupil-primary',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___leerling-link-tekst-in-geel'
				// 	),
				// 	value: 'pupil-link',
				// },
				// {
				// 	label: AdminConfigManager.getConfig().services.i18n.tText(
				// 		'admin/content-block/content-block___leerling-link-geel-inline'
				// 	),
				// 	value: 'pupil-inline-link',
				// },
			],
		},
		content_blocks: {
			[ContentBlockType.Search]: () => <p>Search block mock</p>,
		},
		services: {
			toastService: {
				showToast: (toastInfo: ToastInfo) => {
					// Client decides how the toast messages are shown
					console.info('show toast: ', toastInfo);
				},
			},
			// Use the default endpoint of the admin-core-api: ${proxyUrl}/admin/content-pages
			// https://app.diagrams.net/#G1WCrp76U14pGpajEplYlSVGiuWfEQpRqI
			getContentPageByPathEndpoint: null,
			i18n: {
				tHtml: (key: string, params: TOptions | string | undefined): ReactNode => (
					<Html content={i18n.t(key, params as any) as unknown as string} type="span" />
				),
				tText: (key: string, params: TOptions | string | undefined): string =>
					i18n.t(key, params as any) as unknown as string,
			},
			educationOrganisationService: {
				fetchEducationOrganisationName: (orgId: string, unitId: string) =>
					Promise.resolve(
						DUMMY_EDUCATIONAL_ORGANISATIONS.find(
							(org) => org.organizationId === orgId && org.unitId === unitId
						)?.label || orgId
					),
				fetchCities: () => Promise.resolve(['GENT (9000)']),
				fetchEducationOrganisations: () => Promise.resolve(DUMMY_EDUCATIONAL_ORGANISATIONS),
			},
			router: routerConfig as any,
			queryCache: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				clear: async (_key: string) => Promise.resolve(),
			},
		},
		database: {
			databaseApplicationType: DatabaseType.hetArchief,
			proxyUrl,
		},
		flowplayer: {
			FLOW_PLAYER_ID: '',
			FLOW_PLAYER_TOKEN: '',
		},
		handlers: {
			onExternalLink: () => {
				// Client decides what should happen when an external link is clicked
			},
		},
		routes: {
			ALERTS_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.alerts}`,
			BUNDLE_DETAIL: `/${ROUTE_PARTS.bundles}/:id`,
			BUNDLE_EDIT: `/${ROUTE_PARTS.bundles}/:id/${ROUTE_PARTS.edit}`,
			COLLECTIONS_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.collections}`,
			COLLECTION_DETAIL: `/${ROUTE_PARTS.collections}/:id`,
			CONTENT_PAGE_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/${ROUTE_PARTS.create}`,
			CONTENT_PAGE_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id`,
			CONTENT_PAGE_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id/${ROUTE_PARTS.edit}`,
			CONTENT_PAGE_LABEL_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.contentPageLabels}/${ROUTE_PARTS.create}`,
			CONTENT_PAGE_LABEL_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.contentPageLabels}/:id`,
			CONTENT_PAGE_LABEL_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.contentPageLabels}/:id/${ROUTE_PARTS.edit}`,
			CONTENT_PAGE_LABEL_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.contentPageLabels}`,
			CONTENT_PAGE_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
			ITEM_DETAIL: `/${ROUTE_PARTS.item}/:id`,
			NAVIGATION_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/${ROUTE_PARTS.create}`,
			NAVIGATION_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/:navigationBarId`,
			NAVIGATION_ITEM_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/:navigationBarId/${ROUTE_PARTS.create}`,
			NAVIGATION_ITEM_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/:navigationBarId/:navigationItemId/${ROUTE_PARTS.edit}`,
			NAVIGATION_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}`,
			NEWS: `/${ROUTE_PARTS.news}`,
			TRANSLATIONS_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translations}`,
			USER_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.users}/:id`,
			USER_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.users}/:id/${ROUTE_PARTS.edit}`,
			USER_GROUP_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/${ROUTE_PARTS.create}`,
			USER_GROUP_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/:id`,
			USER_GROUP_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/:id/${ROUTE_PARTS.edit}`,
			USER_GROUP_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}`,
			USER_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.users}`,
			SEARCH: `/${ROUTE_PARTS.search}`,
		},
		users: {
			bulkActions: ['block', 'unblock', 'delete', 'change_subjects', 'export'],
		},
		env: {
			LDAP_DASHBOARD_PEOPLE_URL: 'https://google.com?q=people',
		},
	});
}

function renderApp() {
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		document.getElementById('root')
	);
}

async function bootstrapApp() {
	await initI18n(proxyUrl);
	setConfig();
	renderApp();
}

bootstrapApp().catch((err) => console.error(err));
