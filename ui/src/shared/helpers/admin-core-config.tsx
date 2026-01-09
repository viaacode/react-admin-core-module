import { type DefaultProps, IconName } from '@viaa/avo2-components';
import type { AvoCoreDatabaseType, AvoEducationOrganizationOrganization } from '@viaa/avo2-types';
import { capitalize, lowerCase } from 'es-toolkit';
import type { TOptions } from 'i18next';
import type { FunctionComponent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AdminConfigManager } from '~core/config/config.class';
import type { AdminConfig, LinkInfo, NavigateFunction, ToastInfo } from '~core/config/config.types';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';
import {
	type ContentPageInfo,
	ContentPageWidth,
} from '~modules/content-page/types/content-pages.types';
import { Locale } from '~modules/translations/translations.core.types';
import { UserBulkAction } from '~modules/user/user.types';
import Html from '~shared/components/Html/Html';
import { ROUTE_PARTS } from '~shared/consts/routes';
import { tText } from '~shared/helpers/translation-functions';
import { getMockCommonUser } from '../../mock-common-user';
import i18n from '../translations/i18n';

const DUMMY_EDUCATIONAL_ORGANISATIONS: AvoEducationOrganizationOrganization[] = [
	{
		organisationId: '50674',
		organisationLabel: 'Academie de Kunstbrug Gent',
		unitId: '50674-5-316',
		unitStreet: 'Bargiekaai 1',
	},
	{
		organisationId: '50674',
		organisationLabel: 'Academie de Kunstbrug Gent',
		unitId: '50674-24-316',
		unitStreet: 'Cataloniëstraat 1',
	},
	{
		organisationId: '50674',
		organisationLabel: 'Academie de Kunstbrug Gent',
		unitId: '50674-2-316',
		unitStreet: 'Coupure Rechts 52',
	},
	{
		organisationId: '50674',
		organisationLabel: 'Academie de Kunstbrug Gent',
		unitId: '50674-4-316',
		unitStreet: 'Ottogracht Kunstencampus 4',
	},
];

interface AvoSpinnerProps extends DefaultProps {
	children?: ReactNode;
	size?: 'large';
	light?: boolean;
}

interface HetArchiefLoadingProps extends DefaultProps {
	children?: ReactNode;
	fullscreen?: boolean;
	mode?: 'light' | 'dark';
	centeredHorizontally?: boolean;
	owner: string; // Used to identify which loader is shown
}

export function getAdminCoreConfig(navigateFunc: NavigateFunction): AdminConfig {
	return {
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
				ContentBlockType.CTAs,
				// AVO
				ContentBlockType.AnchorLinks,
				ContentBlockType.MediaGrid,
				ContentBlockType.Uitgeklaard,
				ContentBlockType.ImageTitleTextButton,
				ContentBlockType.AvoImageTextBackground,
				// HET_ARCHIEF
				// ContentBlockType.ThreeClickableTiles,
				// ContentBlockType.TagsWithLink,
				// ContentBlockType.CardsWithoutDescription,
				// ContentBlockType.ImageTextBackground,
				// ContentBlockType.MaintainersGrid,
				// ContentBlockType.HetArchiefHeaderSearch,
				// ContentBlockType.OverviewNewspaperTitles,
				// ContentBlockType.ContentEncloseGrid,
				// ContentBlockType.Breadcrumbs,
			],
			defaultPageWidth: ContentPageWidth.LARGE,
			onSaveContentPage: async (contentPageInfo: ContentPageInfo) => {
				console.info('event handler: onSaveContentPage', { contentPageInfo });
			},
		},
		navigationBars: {
			enableIcons: true,
			customNavigationElements: ['<PROFILE_DROPDOWN>', '<VISITOR_SPACES_DROPDOWN>'],
		},
		staticPages: {
			nl: [
				`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
				`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}`,
				`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}`,
				`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.users}`,
			],
			en: [
				`/${ROUTE_PARTS.admin}/content-pages`,
				`/${ROUTE_PARTS.admin}/navigation`,
				`/${ROUTE_PARTS.admin}/user-groups`,
				`/${ROUTE_PARTS.admin}/users`,
			],
		},
		icon: {
			component: ({ name }: { name: string }) => <span>{name}</span>,
			componentProps: {
				add: { name: 'add' },
				view: { name: 'view' },
				angleDown: { name: 'down' },
				angleUp: { name: 'up' },
				angleLeft: { name: 'left' },
				angleRight: { name: 'right' },
				anglesLeft: { name: 'anglesLeft' },
				anglesRight: { name: 'anglesRight' },
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
				warning: { name: 'exclamation' },
				eyeOff: { name: 'eye-off' },
				video: { name: 'video' },
				audio: { name: 'audio' },
				newspaper: { name: 'newspaper' },
				noAudio: { name: 'no-audio' },
				noVideo: { name: 'no-video' },
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
				component: (props: AvoSpinnerProps | HetArchiefLoadingProps) => {
					// biome-ignore lint/suspicious/noExplicitAny: locationId parameter still needs to be added to avo and hetarchief spinners
					return <div data-location-id={(props as any).locationId}>Loading...</div>;
				},
			},
			defaultAudioStill: 'FAKE_DEFAULT_AUDIO_STILL',
			enableMultiLanguage: true,
			buttonTypes: () => [
				// Het archief buttons
				// {
				// 	label: tText('index___zilver'),
				// 	value: 'content-page-button--silver',
				// },
				// {
				// 	label: tText(
				// 		'index___blauw-groen'
				// 	),
				// 	value: 'content-page-button--teal',
				// },
				// {
				// 	label: tText('index___wit'),
				// 	value: 'content-page-button--white',
				// },
				// {
				// 	label: tText('index___zwart'),
				// 	value: 'content-page-button--black',
				// },
				// {
				// 	label: tText('index___outline'),
				// 	value: 'content-page-button--outline',
				// },
				// {
				// 	label: tText('index___tekst'),
				// 	value: 'content-page-button--text',
				// },
				// {
				// 	label: tText('index___rood'),
				// 	value: 'content-page-button--red',
				// },
				// {
				// 	label: tText('index___link'),
				// 	value: 'content-page-button--link',
				// },

				// Avo buttons
				{
					label: tText('admin/content-block/content-block___primair'),
					value: 'primary',
				},
				{
					label: tText('admin/content-block/content-block___secundair'),
					value: 'secondary',
				},
				{
					label: tText('admin/content-block/content-block___secundair-invers'),
					value: 'secondary-i',
				},
				{
					label: tText('admin/content-block/content-block___tertiair'),
					value: 'tertiary',
				},
				{
					label: tText('admin/content-block/content-block___randloos'),
					value: 'borderless',
				},
				{
					label: tText('admin/content-block/content-block___randloos-invers'),
					value: 'borderless-i',
				},
				{
					label: tText('admin/content-block/content-block___gevaar'),
					value: 'danger',
				},
				{
					label: tText('admin/content-block/content-block___gevaar-hover'),
					value: 'danger-hover',
				},
				{
					label: tText('admin/content-block/content-block___link'),
					value: 'link',
				},
				{
					label: tText('admin/content-block/content-block___link-inline'),
					value: 'inline-link',
				},
				{
					label: tText('admin/content-block/content-block___leerling-primair-geel'),
					value: 'pupil-primary',
				},
				{
					label: tText('admin/content-block/content-block___leerling-link-tekst-in-geel'),
					value: 'pupil-link',
				},
				{
					label: tText('admin/content-block/content-block___leerling-link-geel-inline'),
					value: 'pupil-inline-link',
				},
			],
		},
		content_blocks: {
			[ContentBlockType.Search]: () => <p>Search block mock</p>,
			[ContentBlockType.MediaGrid]: () => <p>Media grid block mock</p>,
		},
		services: {
			toastService: {
				showToast: (toastInfo: ToastInfo): string => {
					// Client decides how the toast messages are shown
					console.info('show toast: ', toastInfo);
					return 'fake-toast-id';
				},
				hideToast: (toastId: string) => {
					// Client decides how the toast messages are hidden
					console.info('hide toasts with id: ', toastId);
				},
			},
			// Use the default endpoint of the admin-core-api: ${proxyUrl}/admin/content-pages
			// https://app.diagrams.net/#G1WCrp76U14pGpajEplYlSVGiuWfEQpRqI
			// AVO
			// getContentPageByLanguageAndPathEndpoint: `${proxyUrl}/admin/content-pages/by-language-and-path`,
			// HET_ARCHIEF
			getContentPageByLanguageAndPathEndpoint: null,
			i18n: {
				tHtml: (key: string, params: TOptions | string | undefined): ReactNode => (
					<Html
						// biome-ignore lint/suspicious/noExplicitAny: todo
						content={i18n.t(key, params as any) as unknown as string}
						type="span"
					/>
				),
				tText: (key: string, params: TOptions | string | undefined): string =>
					// biome-ignore lint/suspicious/noExplicitAny: todo
					i18n.t(key, params as any) as unknown as string,
			},
			educationOrganisationService: {
				fetchEducationOrganisationName: (orgId: string, unitId: string) =>
					Promise.resolve(
						DUMMY_EDUCATIONAL_ORGANISATIONS.find(
							(org) => org.organisationId === orgId && org.unitId === unitId
						)?.organisationLabel || orgId
					),
				fetchCities: () => Promise.resolve(['GENT (9000)']),
				fetchEducationOrganisations: () => Promise.resolve(DUMMY_EDUCATIONAL_ORGANISATIONS),
			},
			router: {
				Link: Link as FunctionComponent<LinkInfo>,
				navigateFunc,
			},
			queryCache: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				clear: async (_key: string) => Promise.resolve(),
			},
		},
		database: {
			proxyUrl: 'http://localhost:3100',
			adminCoreApiUrl: 'http://localhost:3300',
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
			ADMIN_DASHBOARD: `/${ROUTE_PARTS.admin}`,
			ADMIN_CONTENT_PAGE_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/${ROUTE_PARTS.create}`,
			ADMIN_CONTENT_PAGE_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id`,
			ADMIN_CONTENT_PAGE_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id/${ROUTE_PARTS.edit}`,
			ADMIN_CONTENT_PAGE_LABEL_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.contentPageLabels}/${ROUTE_PARTS.create}`,
			ADMIN_CONTENT_PAGE_LABEL_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.contentPageLabels}/:id`,
			ADMIN_CONTENT_PAGE_LABEL_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.contentPageLabels}/:id/${ROUTE_PARTS.edit}`,
			ADMIN_CONTENT_PAGE_LABEL_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.contentPageLabels}`,
			ADMIN_CONTENT_PAGE_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
			ADMIN_NAVIGATION_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/${ROUTE_PARTS.create}`,
			ADMIN_NAVIGATION_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/:navigationBarId`,
			ADMIN_NAVIGATION_ITEM_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/:navigationBarId/${ROUTE_PARTS.create}`,
			ADMIN_NAVIGATION_ITEM_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/:navigationBarId/:navigationItemId/${ROUTE_PARTS.edit}`,
			ADMIN_NAVIGATION_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}`,
			ADMIN_TRANSLATIONS_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translations}`,
			ADMIN_USER_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.users}/:id/${ROUTE_PARTS.edit}`,
			ADMIN_USER_GROUP_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/${ROUTE_PARTS.create}`,
			ADMIN_USER_GROUP_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/:id`,
			ADMIN_USER_GROUP_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/:id/${ROUTE_PARTS.edit}`,
			ADMIN_USER_GROUP_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}`,
			ADMIN_USER_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.users}`,
			ADMIN_MAINTENANCE_ALERTS_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.alerts}`,

			// Avo specific routes
			ADMIN_USER_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.users}/:id`,
			ADMIN_ASSIGNMENTS_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.assignments}`,
			ADMIN_ASSIGNMENT_PUPIL_COLLECTIONS_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.pupilCollections}`,
			ADMIN_BUNDLES_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.bundles}`,
			ADMIN_COLLECTIONS_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.collections}`,
			ASSIGNMENT_DETAIL: `/${ROUTE_PARTS.workspace}/${ROUTE_PARTS.assignments}/:id`,
			BUNDLE_DETAIL: `/${ROUTE_PARTS.bundles}/:id`,
			BUNDLE_EDIT: `/${ROUTE_PARTS.bundles}/:id/${ROUTE_PARTS.edit}`,
			COLLECTION_DETAIL: `/${ROUTE_PARTS.collections}/:id`,
			ITEM_DETAIL: `/${ROUTE_PARTS.item}/:id`,
			NEWS: `/${ROUTE_PARTS.news}`,
			SEARCH: `/${ROUTE_PARTS.search}`,
		},
		users: {
			bulkActions: [
				UserBulkAction.BLOCK,
				UserBulkAction.UNBLOCK,
				UserBulkAction.DELETE,
				UserBulkAction.CHANGE_SUBJECTS,
				UserBulkAction.EXPORT_SELECTION,
				UserBulkAction.EXPORT_ALL,
			],
			getCommonUser: () => getMockCommonUser(),
		},
		locale: Locale.Nl,
		env: {
			LDAP_DASHBOARD_PEOPLE_URL: 'https://google.com?q=people',
			CLIENT_URL: 'http://localhost:3400',
			// https://vite.dev/config/shared-options#envprefix
			DATABASE_APPLICATION_TYPE: import.meta.env.DATABASE_APPLICATION_TYPE as AvoCoreDatabaseType,
		},
	};
}

export function setAdminCoreConfig(navigateFunc: NavigateFunction) {
	// only used for starting admin-core separately
	AdminConfigManager.setConfig(getAdminCoreConfig(navigateFunc));
}
