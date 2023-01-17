import { LinkInfo, ToastInfo } from '~core/config/config.types';
import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';
import { TOptions } from 'i18next';

import App from './App';
import i18n, { initI18n } from './shared/translations/i18n';
import { Link, useHistory } from 'react-router-dom';
import { DatabaseType } from '@viaa/avo2-types';
import { AdminConfig, AdminConfigManager } from '~core/config';
import { AssetsService } from './shared/services/assets.service';
import { mockUser } from './mock-user';
import { ContentPageInfo, ContentWidth } from '~modules/content-page/types/content-pages.types';
import Html from '~modules/shared/components/Html/Html';
import { ROUTE_PARTS } from '~modules/shared/consts/routes';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';

const proxyUrl = 'http://localhost:3300';

const routerConfig: AdminConfig['services']['router'] = {
	Link: Link as FunctionComponent<LinkInfo>,
	useHistory: useHistory,
};

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
			],
			defaultPageWidth: ContentWidth.LARGE,
			onSaveContentPage: async (contentPageInfo: ContentPageInfo) => {
				console.info('event handler: onSaveContentPage', { contentPageInfo });
			},
		},
		navigationBars: {
			enableIcons: true,
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
			list: () => [
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___afbeelding'
					),
					value: 'image',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___aktetas'
					),
					value: 'briefcase',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___audio'
					),
					value: 'headphone',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___collectie'
					),
					value: 'collection',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___download'
					),
					value: 'download',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___externe-link'
					),
					value: 'external-link',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___help'
					),
					value: 'help-circle',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___info'
					),
					value: 'info',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___kalender'
					),
					value: 'calendar',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___klascement'
					),
					value: 'klascement',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___link'
					),
					value: 'link-2',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___link-delen'
					),
					value: 'share-2',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___login'
					),
					value: 'log-in',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___opdracht'
					),
					value: 'clipboard',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___profiel'
					),
					value: 'user',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___smartschool'
					),
					value: 'smartschool',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___tekstbestand'
					),
					value: 'file-text',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___uploaden'
					),
					value: 'upload',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___video'
					),
					value: 'video',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___view'
					),
					value: 'eye',
				},
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/constants/index___zoek'
					),
					value: 'search',
				},
			],
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
			assetService: AssetsService,
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
				tHtml: (key: string, params: TOptions | string | undefined) => (
					<Html content={i18n.t(key, params as any) as unknown as string} />
				),
				tText: (key: string, params: TOptions | string | undefined) =>
					i18n.t(key, params as any) as unknown as string,
			},
			educationOrganisationService: {
				fetchEducationOrganisationName: () => Promise.resolve(null),
				fetchCities: () => Promise.resolve([]),
				fetchEducationOrganisations: () => Promise.resolve([]),
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
			mediaItemClicked: () => {
				// TODO set redux value in the avo client and open a global modal to render the media item
				// See AVO2-client src/admin/content-block/components/wrappers/MediaGridWrapper/MediaGridWrapper.tsx => handleItemClicked()
			},
		},
		user: mockUser,
		route_parts: ROUTE_PARTS,
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
