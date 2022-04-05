import { AvoOrHetArchief } from '~modules/shared/types';
import { AdminCore } from './react-admin';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

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

AdminCore.config.setConfig({
	navigation: {
		service: {
			getAll: async () => {
				return [navItem];
			},
			getByPlacement: async () => [navItem],
			getById: async (id) => {
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
			showToast: () => {},
		},
		i18n: {
			t: () => '',
		},
		educationOrganisationService: {
			fetchEducationOrganisationName: () => Promise.resolve(null),
			fetchCities: () => Promise.resolve([]),
			fetchEducationOrganisations: () => Promise.resolve([]),
		},
	},
	database: {
		databaseApplicationType: AvoOrHetArchief.hetArchief,
		graphqlUrl: '',
		graphqlSecret: '',
		proxyUrl: 'http://localhost:3100',
	},
	flowplayer: {
		FLOW_PLAYER_ID: '',
		FLOW_PLAYER_TOKEN: '',
	},
	handlers: {
		onExternalLink: () => {},
	},
});

AdminCore.routes.register({
	path: '/users',
	component: () => <h1>Users</h1>,
});

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);
