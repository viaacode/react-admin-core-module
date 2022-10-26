import { LinkInfo, ToastInfo } from '~core/config/config.types';
import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { TOptions } from 'i18next';

import App from './App';
import i18n, { initI18n } from './translations/i18n';
import { Link, useHistory, useParams } from 'react-router-dom';
import { AvoOrHetArchief } from '~modules/shared/types';
import { AdminConfig, AdminConfigManager } from '~core/config';
import { AssetsService } from './shared/services/assets.service';
import { mockUser } from './mock-user';
import { PermissionsService } from './modules/permissions/permissions.service';
import { UserGroupsService } from './modules/user-group/user-groups.service';
import { ContentBlockType } from '~modules/content-page';
import { ContentPageInfo, ContentWidth } from '~modules/content-page/types/content-pages.types';
import Html from '~modules/shared/components/Html/Html';

const proxyUrl = 'http://localhost:3300/admin'; // admin-core-api url

const routerConfig: AdminConfig['services']['router'] = {
	Link: Link as FunctionComponent<LinkInfo>,
	useHistory: useHistory,
	useParams: useParams,
};

function setConfig() {
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
			],
			defaultPageWidth: ContentWidth.LARGE,
			onSaveContentPage: async (contentPageInfo: ContentPageInfo) => {
				console.log('event handler: onSaveContentPage', { contentPageInfo });
			},
		},
		navigationBars: {
			enableIcons: false,
		},
		staticPages: [
			'/admin/content',
			'/admin/navigatie',
			'/admin/gebruikersgroep',
			'/admin/gebruikers',
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
				filter: { name: 'filter' },
				arrowUp: { name: 'arrow-up' },
				sortTable: { name: 'sort-table' },
				arrowDown: { name: 'arrow-down' },
			},
			list: [],
		},
		components: {
			loader: {
				component: () => <></>,
			},
			table: {
				sortingIcons: {
					asc: <></>,
					desc: <></>,
					default: <></>,
				},
			},
			buttonTypes: () => [
				// Het archief buttons
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('Zilver'),
					value: 'content-page-button--silver',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('Blauw groen'),
					value: 'content-page-button--teal',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('Wit'),
					value: 'content-page-button--white',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('Zwart'),
					value: 'content-page-button--black',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('Outline'),
					value: 'content-page-button--outline',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('Tekst'),
					value: 'content-page-button--text',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('Rood'),
					value: 'content-page-button--red',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('Link'),
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
		services: {
			assetService: AssetsService,
			toastService: {
				showToast: (toastInfo: ToastInfo) => {
					// Client decides how the toast messages are shown
					console.log('show toast: ', toastInfo);
				},
			},
			i18n: {
				tHtml: (key: string, params: TOptions | string | undefined) => (
					<Html content={i18n.t(key, params)} />
				),
				tText: (key: string, params: TOptions | string | undefined) => i18n.t(key, params),
			},
			educationOrganisationService: {
				fetchEducationOrganisationName: () => Promise.resolve(null),
				fetchCities: () => Promise.resolve([]),
				fetchEducationOrganisations: () => Promise.resolve([]),
			},
			router: routerConfig as any,
			UserGroupsService,
			PermissionsService,
			queryCache: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				clear: async (_key: string) => Promise.resolve(),
			},
		},
		database: {
			databaseApplicationType: AvoOrHetArchief.hetArchief,
			graphqlUrl: '',
			graphqlSecret: '',
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
			mediaItemClicked: () => {
				// TODO set redux value in the avo client and open a global modal to render the media item
				// See AVO2-client src/admin/content-block/components/wrappers/MediaGridWrapper/MediaGridWrapper.tsx => handleItemClicked()
			},
		},
		user: mockUser,
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