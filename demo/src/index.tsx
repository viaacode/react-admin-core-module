import { LinkInfo, ToastInfo } from '~core/config/config.types';
import React, { FunctionComponent } from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import I18n, { initI18n } from './translations/i18n';
import { Link, useHistory, useParams } from 'react-router-dom';
import { AvoOrHetArchief } from '~modules/shared/types';
import { Config, ConfigValue } from '~core/config';
import { Idp, Permission } from '~modules/user/user.types';
import { FileUploadService } from './shared/services/file-upload-service';

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
			assetService: FileUploadService,
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
			queryCache: {
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
		user: {
			profileId: '89eac875-6ee4-4940-9dde-68b85a9c33cf',
			fullName: 'Bert3 Verhelst3',
			firstName: 'Bert3',
			lastName: 'Verhelst3',
			email: 'bert.verhelst@studiohyperdrive.be',
			acceptedTosAt: '2022-05-16T10:06:58.282+00:00',
			userGroup: 'MEEMOO_ADMIN',
			permissions: [
				Permission.APPROVE_DENY_ALL_VISIT_REQUESTS,
				Permission.CREATE_VISIT_REQUEST,
				Permission.EDIT_ANY_CONTENT_PAGES,
				Permission.EDIT_OWN_CONTENT_PAGES,
				Permission.EDIT_PERMISSION_GROUPS,
				Permission.EXPORT_OBJECT,
				Permission.MANAGE_ACCOUNT,
				Permission.MANAGE_FOLDERS,
				Permission.READ_ALL_SPACES,
				Permission.READ_ALL_VISIT_REQUESTS,
				Permission.READ_PERSONAL_APPROVED_VISIT_REQUESTS,
				Permission.SEARCH_ALL_OBJECTS,
				Permission.SEARCH_OBJECTS,
				Permission.UPDATE_ALL_SPACES,
				Permission.UPDATE_OWN_SPACE,
				Permission.UPDATE_VISIT_REQUEST,
			],
			idp: Idp.HETARCHIEF,
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
