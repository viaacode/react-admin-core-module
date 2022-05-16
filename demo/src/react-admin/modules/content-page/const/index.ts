const ROOT = 'content';
const DETAIL = ':contentPageId';

export const CONTENT_PAGES_PATHS = {
	overview: `/${ROOT}`,
	detail: `/${ROOT}/${DETAIL}`,
	create: `/${ROOT}/${DETAIL}/maak`,
	edit: `/${ROOT}/${DETAIL}/bewerk`,
};

export const CONTENT_PAGES_CONFIG = {
	views: {
		overview: {
			meta: {
				title: "Contentpagina's - beheer",
				description: "Overzicht van de door meemoo beheerde pagina's van de website",
			},
			labels: {
				pageTitle: "Content Pagina's: overzicht",
				createButton: 'Content Pagina toevoegen',
			},
			error: {},
		},
		detail: {
			labels: {},
		},
		edit: {
			labels: {},
		},
	},
};
