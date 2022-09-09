import { LinkInfo, ToastInfo } from '~core/config/config.types';
import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import I18n, { initI18n } from './translations/i18n';
import { Link, useHistory, useParams } from 'react-router-dom';
import { AvoOrHetArchief } from '~modules/shared/types';
import { AdminConfig, AdminConfigManager } from '~core/config';
import { AssetsService } from './shared/services/assets.service';
import { mockUser } from './mock-user';
import { PermissionsService } from './modules/permissions/permissions.service';
import { UserGroupsService } from './modules/user-group/user-groups.service';
import { ContentBlockType } from '~modules/content-page';
import { ContentPageInfo, ContentWidth } from '~modules/content-page/types/content-pages.types';

const proxyUrl = 'http://localhost:3100';

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
		},
		services: {
			assetService: AssetsService,
			toastService: {
				showToast: (toastInfo: ToastInfo) => {
					// Client decides how the toast messages are shown
					console.log('show toast: ', toastInfo);
				},
			},
			i18n: I18n,
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
				clear: async (key: string) => Promise.resolve(),
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
