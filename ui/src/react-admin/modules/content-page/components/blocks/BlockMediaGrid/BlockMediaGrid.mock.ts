import { ButtonType, IconName, testRenderLink } from '@viaa/avo2-components';
import { action } from '~shared/helpers/action';
import image500x200 from '../../../static/images/500x200.jpg';

import { BlockMediaGridProps, MediaListItem } from './BlockMediaGrid';

export const MEDIA_LIST_ITEMS_MOCK: MediaListItem[] = [
	{
		category: 'collection',
		metadata: [{ icon: 'eye' as IconName, label: '1005' }, { label: '10/10/2020' }],
		buttonLabel: 'meer lezen',
		buttonIcon: 'eye' as IconName,
		buttonType: 'danger',
		buttonAction: {
			type: 'INTERNAL_LINK',
			value: '/collecties/1',
		},
		itemAction: {
			type: 'COLLECTION',
			value: '/collecties/1',
		},
		title: 'Collectie 1',
		thumbnail: { label: 'Collectie', meta: '3 items' },
	},
	{
		category: 'audio',
		metadata: [{ label: '02/02/2020' }],
		title: 'Audio fragment 1',
		buttonLabel: 'meer lezen',
		buttonIcon: 'eye' as IconName,
		buttonType: 'danger',
		buttonAction: {
			type: 'INTERNAL_LINK',
			value: '/items/1',
		},
		itemAction: {
			type: 'INTERNAL_LINK',
			value: '/items/1',
		},
		thumbnail: { label: 'audio', meta: '5 items', src: image500x200 },
		src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
	},
	{
		category: 'collection',
		metadata: [{ label: '02/02/2020' }],
		title: 'Collectie 2',
		buttonLabel: 'google',
		buttonIcon: 'eye' as IconName,
		buttonType: 'secondary',
		buttonAction: {
			type: 'EXTERNAL_LINK',
			value: 'http://google.com',
		},
		itemAction: {
			type: 'INTERNAL_LINK',
			value: '/items/1',
		},
		thumbnail: { label: 'Collectie', meta: '7 items', src: image500x200 },
	},
	{
		category: 'collection',
		metadata: [{ icon: 'eye' as IconName, label: '25' }, { label: '02/02/2020' }],
		title: 'Collectie 3',
		buttonAction: {
			type: 'INTERNAL_LINK',
			value: '/collecties/3',
		},
		itemAction: {
			type: 'INTERNAL_LINK',
			value: '/items/1',
		},
		thumbnail: { label: 'Collectie', meta: '5 items', src: image500x200 },
	},
	{
		category: 'video',
		metadata: [{ icon: 'eye' as IconName, label: '195' }, { label: '02/02/2020' }],
		title: 'Video fragment 1',
		itemAction: {
			type: 'ITEM',
			value: 'pv6b29xh1k',
		},
		thumbnail: { label: 'Video' },
		src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
	},
	{
		category: 'video',
		metadata: [{ label: '02/02/2020' }],
		title: 'Video fragment 2',
		buttonLabel: 'meer lezen',
		buttonIcon: 'eye' as IconName,
		buttonType: 'danger',
		buttonAction: {
			type: 'INTERNAL_LINK',
			value: '/items/3',
		},
		itemAction: {
			type: 'INTERNAL_LINK',
			value: '/items/1',
		},
		thumbnail: { label: 'Video', src: image500x200 },
		src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
	},
	{
		category: 'audio',
		metadata: [{ icon: 'eye' as IconName, label: '347' }, { label: '02/02/2020' }],
		title: 'Audio fragment 2 en nog wat lange tekst die op 2 regels over loopt',
		buttonLabel: 'meer lezen',
		buttonIcon: 'eye' as IconName,
		buttonType: 'danger',
		buttonAction: {
			type: 'INTERNAL_LINK',
			value: '/items/4',
		},
		itemAction: {
			type: 'INTERNAL_LINK',
			value: '/items/4',
		},
		thumbnail: { label: 'Audio' },
		src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
	},
	{
		category: 'collection',
		metadata: [{ label: '02/02/2020' }],
		title: 'Collectie 4',
		buttonLabel: 'meer lezen',
		buttonIcon: 'eye' as IconName,
		buttonType: 'danger',
		buttonAction: {
			type: 'INTERNAL_LINK',
			value: '/collecties/4',
		},
		itemAction: {
			type: 'INTERNAL_LINK',
			value: '/collecties/4',
		},
		thumbnail: { label: 'Collectie', meta: '2 items', src: image500x200 },
	},
];

export const MEDIA_LIST_MOCK: BlockMediaGridProps = {
	title: 'Collecties secundair onderwijs',
	elements: MEDIA_LIST_ITEMS_MOCK,
	renderLink: testRenderLink(action('navigate to: ')),
	renderMediaCardWrapper: (mediaCard) => mediaCard,
};

export const MEDIA_LIST_TITLE_MOCK: BlockMediaGridProps = {
	title: 'Collecties secundair onderwijs',
	elements: MEDIA_LIST_ITEMS_MOCK,
	renderLink: testRenderLink(action('navigate to')),
	renderMediaCardWrapper: (mediaCard) => mediaCard,
};

export const MEDIA_LIST_TITLE_BUTTON_MOCK: BlockMediaGridProps = {
	...MEDIA_LIST_TITLE_MOCK,
	buttonLabel: 'Bekijk het volledige aanbod',
	buttonAction: {
		type: 'INTERNAL_LINK',
		value: '/zoeken?filters....',
	},
};

export const MEDIA_LIST_CTA_MOCK: BlockMediaGridProps = {
	ctaTitle: 'Call to action',
	ctaContent: 'Wil je meer weten?',
	ctaButtonLabel: 'Ontdek meer',
	ctaButtonIcon: 'delete' as IconName,
	elements: MEDIA_LIST_ITEMS_MOCK.slice(0, -1),
	ctaButtonAction: {
		type: 'EXTERNAL_LINK',
		value: 'http://google.com',
	},
	renderLink: testRenderLink(action('navigate to')),
	renderMediaCardWrapper: (mediaCard) => mediaCard,
};

export const MEDIA_LIST_CTA_MOCK_WITHOUT_BUTTONS: BlockMediaGridProps = {
	ctaTitle: 'Call to action',
	ctaContent: 'Wil je meer weten?',
	ctaButtonLabel: 'Ontdek meer',
	ctaButtonIcon: 'delete' as IconName,
	elements: MEDIA_LIST_ITEMS_MOCK.slice(0, -1).map((mock) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { buttonLabel, buttonIcon, buttonType, ...rest } = mock;
		return rest;
	}),
	ctaButtonAction: {
		type: 'EXTERNAL_LINK',
		value: 'http://google.com',
	},
	renderLink: testRenderLink(action('navigate to')),
	renderMediaCardWrapper: (mediaCard) => mediaCard,
};

export const MEDIA_LIST_COLORED_CTA_MOCK: BlockMediaGridProps = {
	...MEDIA_LIST_CTA_MOCK,
	ctaTitleColor: '#FF0000',
	ctaContentColor: '#00FF00',
	ctaButtonType: 'danger' as ButtonType,
	ctaBackgroundColor: '#0000FF',
};

export const MEDIA_LIST_IMAGE_CTA_MOCK: BlockMediaGridProps = {
	...MEDIA_LIST_COLORED_CTA_MOCK,
	ctaBackgroundImage: '/images/thumbnail.jpg',
};
