import { LinkInfo, ToastInfo } from '~core/config/config.types';
import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import I18n, { initI18n } from './translations/i18n';
import { Link, useHistory, useParams } from 'react-router-dom';
import { AvoOrHetArchief } from '~modules/shared/types';
import { Config, ConfigValue } from '~core/config';
import { promises } from 'stream';

const navItem = {
	content_path: 'content_path',
	content_type: 'faq',
	created_at: 'now',
	description: 'description',
	id: '224242',
	label: 'label',
	icon_name: '',
	user_group_ids: [],
	link_target: null,
	position: 0,
	placement: 'nav',
	updated_at: 'now',
	tooltip: '',
};

const proxyUrl = 'http://localhost:3100';

const routerConfig: ConfigValue['services']['router'] = {
	Link: Link as FunctionComponent<LinkInfo>,
	useHistory: useHistory,
	useParams: useParams,
};

function setConfig() {
	Config.setConfig({
		navigation: {
			service: {
				getAll: async () => {
					return [navItem];
				},
				getByPlacement: async () => [navItem],
				getById: async () => {
					return navItem;
				},
				delete: async () => null,
				insert: async () => '12345',
				updateById: async () => navItem,
			},
			views: {
				overview: {
					labels: { tableHeads: {} },
				},
			},
		},
		icon: {
			component: ({ name }: any) => <span>{name}</span>,
			componentProps: {
				add: { name: 'add' },
				view: { name: 'view' },
				angleDown: { name: 'down' },
				angleUp: { name: 'up' },
				delete: { name: 'delete' },
				edit: { name: 'edit' },
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
			UserGroupsService: {
				getAllUserGroups: () => {
					console.log('get all user groups');
					return Promise.resolve([]);
				},
				updateUserGroups: (values) => {
					console.log('update user groups: ', values);
					return Promise.resolve([])
				}
			},
			PermissionsService: {
				getAllPermissions: () => {
					console.log('get all permissions');
					return Promise.resolve([]);
				},
			},
			queryCache: {
				clear: async (key: string) => Promise.resolve(),
			}
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

bootstrapApp().catch(err => console.error(err));
