import type { ButtonAction } from '@viaa/avo2-components';
import { LinkTarget } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { fromPairs, get, isEmpty, isNil, isString, map } from 'lodash-es';
import { stringify } from 'query-string';
import type { ReactNode } from 'react';

import { AdminConfigManager } from '~core/config';
import type { History } from '~core/config/config.types';
import { ToastType } from '~core/config/config.types';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';

import { APP_PATH } from '../consts/routes.consts';

import { insideIframe } from './inside-iframe';

type RouteParams = { [key: string]: string | number | undefined };

const getMissingParams = (route: string): string[] => route.split('/').filter((r) => r.match(/^:/));
const navigationConsoleError = (route: string, missingParams: string[] = []) => {
	const paramsString = missingParams.join(', ');
	console.error(`The following params were not included: [${paramsString}] for route ${route}`);
};

export const buildLink = (
	route: string,
	params: RouteParams = {},
	search?: string | { [paramName: string]: string }
): string => {
	let builtLink = route;

	// Replace url with given params
	Object.keys(params).forEach((param: string) => {
		builtLink = builtLink.replace(`:${param}`, String(get(params, [param], '')));
	});

	const missingParams = getMissingParams(builtLink);

	// Return empty string if not all params were replaced
	if (missingParams.length > 0) {
		navigationConsoleError(route, missingParams);

		return '';
	}

	// Add search query if present
	return search ? `${builtLink}?${isString(search) ? search : stringify(search)}` : builtLink;
};

export const navigate = (
	history: History,
	route: string,
	params: RouteParams = {},
	search?: string | { [paramName: string]: string }
) => {
	const missingParams = getMissingParams(route);

	// Abort navigation when params were expected but none were given
	if (missingParams.length > 0 && (isNil(params) || isEmpty(params))) {
		navigationConsoleError(route, missingParams);
		showToast({
			title: tText('modules/admin/shared/helpers/link___error') || '',
			description: tText(
				'shared/helpers/link___de-navigatie-is-afgebroken-wegens-foutieve-parameters'
			),
			type: ToastType.ERROR,
		});

		return;
	}

	// Abort navigation if link build fails
	const builtLink = buildLink(route, params, search);

	if (isEmpty(builtLink)) {
		showToast({
			title: tText('modules/admin/shared/helpers/link___error'),
			description: tText(
				'shared/helpers/link___de-navigatie-is-afgebroken-wegens-foutieve-parameters'
			),
			type: ToastType.ERROR,
		});

		return;
	}

	history.push(builtLink);
};

// TODO see if we can replace this method completely by the new SmartLink component
export function navigateToAbsoluteOrRelativeUrl(
	url: string,
	history: History,
	target: LinkTarget = LinkTarget.Self
) {
	let fullUrl = url;
	if (url.startsWith('www.')) {
		fullUrl = `//${url}`;
	}
	switch (target) {
		case LinkTarget.Self:
			if (fullUrl.includes('//')) {
				// absolute url
				window.location.href = fullUrl;
			} else {
				// relative url
				history.push(fullUrl);
			}
			break;
		default:
			if (fullUrl.includes('//')) {
				// absolute fullUrl
				window.open(fullUrl);
			} else {
				// relative url
				window.open(`${AdminConfigManager.getConfig().env.CLIENT_URL}${fullUrl}`);
			}
			break;
	}
}

export const navigateToContentType = (action: ButtonAction, history: History) => {
	if (action) {
		const { type, value, target } = action;

		let resolvedTarget = target;
		if (insideIframe()) {
			// Klaar page inside smartschool iframe must open all links in new window: https://meemoo.atlassian.net/browse/AVO-1354
			resolvedTarget = LinkTarget.Blank;
		}

		switch (type as Avo.Core.ContentPickerType) {
			case 'INTERNAL_LINK':
			case 'CONTENT_PAGE':
			case 'PROJECTS':
				navigateToAbsoluteOrRelativeUrl(String(value), history, resolvedTarget);
				break;

			case 'COLLECTION': {
				const collectionUrl = buildLink(
					AdminConfigManager.getAdminRoute('COLLECTION_DETAIL'),
					{
						id: value as string,
					}
				);
				navigateToAbsoluteOrRelativeUrl(collectionUrl, history, resolvedTarget);
				break;
			}

			case 'ITEM': {
				const itemUrl = buildLink(AdminConfigManager.getAdminRoute('ITEM_DETAIL'), {
					id: value,
				});
				navigateToAbsoluteOrRelativeUrl(itemUrl, history, resolvedTarget);
				break;
			}

			case 'BUNDLE': {
				const bundleUrl = buildLink(AdminConfigManager.getAdminRoute('BUNDLE_DETAIL'), {
					id: value,
				});
				navigateToAbsoluteOrRelativeUrl(bundleUrl, history, resolvedTarget);
				break;
			}

			case 'EXTERNAL_LINK': {
				const externalUrl = ((value as string) || '').replace(
					'{{PROXY_URL}}',
					getAdminCoreApiUrl() || ''
				);
				navigateToAbsoluteOrRelativeUrl(externalUrl, history, resolvedTarget);
				break;
			}

			case 'ANCHOR_LINK': {
				const urlWithoutQueryOrAnchor = window.location.href.split('?')[0].split('#')[0];
				navigateToAbsoluteOrRelativeUrl(
					`${urlWithoutQueryOrAnchor}#${value}`,
					history,
					resolvedTarget
				);
				break;
			}

			case 'FILE':
				navigateToAbsoluteOrRelativeUrl(value as string, history, LinkTarget.Blank);
				break;

			case 'SEARCH_QUERY': {
				const queryParams = JSON.parse(value as string);
				navigateToAbsoluteOrRelativeUrl(
					buildLink(
						APP_PATH.SEARCH.route,
						{},
						stringify(
							fromPairs(
								map(queryParams, (queryParamValue, queryParam) => [
									queryParam,
									JSON.stringify(queryParamValue),
								])
							)
						)
					),
					history,
					resolvedTarget
				);
				break;
			}

			default:
				break;
		}
	}
};

export function defaultRenderLinkFunction(
	_buttonAction: ButtonAction | undefined | null,
	children: ReactNode,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_label?: string,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_title?: string
): ReactNode | null {
	return <>{children}</>;
}
