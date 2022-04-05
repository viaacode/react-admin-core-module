import { ButtonAction, LinkTarget } from '@viaa/avo2-components';
import clsx from 'clsx';
import { fromPairs, map } from 'lodash-es';
import { stringify } from 'query-string';
import React, { FunctionComponent, ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Config } from '~core/config';
import { BUNDLE_PATH } from '../../consts/bundle.const';
import { APP_PATH } from '../../consts/routes.consts';
import { insideIframe } from '../../helpers/inside-iframe';
import { buildLink } from '../../helpers/link';
import { ContentPickerType } from '../ContentPicker/ContentPicker.const';

export interface SmartLinkProps {
	action?: ButtonAction | null;
	removeStyles?: boolean;
	title?: string;
	children: ReactNode;
}

const SmartLink: FunctionComponent<SmartLinkProps> = ({
	action,
	removeStyles = true,
	title,
	children,
}) => {
	const renderLink = (
		url: string,
		target: LinkTarget = LinkTarget.Self
	): ReactElement<any, any> | null => {
		let fullUrl = url;
		if (url.startsWith('www.')) {
			fullUrl = `//${url}`;
		}

		switch (target) {
			case LinkTarget.Self:
				// Open inside same tab
				if (fullUrl.includes('//')) {
					// absolute url
					return (
						<a
							href={fullUrl}
							target="_self"
							className={clsx({ 'a-link__no-styles': removeStyles })}
							title={title}
							onClick={() => Config.getConfig().handlers.onExternalLink(fullUrl)}
						>
							{children}
						</a>
					);
				}
				// relative url
				return (
					<Link
						to={fullUrl}
						className={clsx({ 'a-link__no-styles': removeStyles })}
						onClick={() => Config.getConfig().handlers.onExternalLink(fullUrl)}
						title={title}
					>
						{children}
					</Link>
				);

			case LinkTarget.Blank:
			default:
				// Open in a new tab
				if (fullUrl.includes('//')) {
					// absolute fullUrl
					return (
						<a
							href={fullUrl}
							target="_blank"
							rel="noopener noreferrer"
							className={clsx({ 'a-link__no-styles': removeStyles })}
							onClick={() => Config.getConfig().handlers.onExternalLink(fullUrl)}
							title={title}
						>
							{children}
						</a>
					);
				}
				// relative url
				return (
					<a
						href={`${window.location.origin}${fullUrl}`}
						target="_blank"
						rel="noopener noreferrer"
						className={clsx({ 'a-link__no-styles': removeStyles })}
						onClick={() => Config.getConfig().handlers.onExternalLink(fullUrl)}
						title={title}
					>
						{children}
					</a>
				);
		}
	};

	const renderSmartLink = (): ReactElement<any, any> | null => {
		if (action) {
			const { type, value, target } = action;

			if (!value) {
				return <>{children}</>;
			}

			let resolvedTarget = target;
			if (insideIframe()) {
				// Klaar page inside smartschool iframe must open all links in new window: https://meemoo.atlassian.net/browse/AVO-1354
				resolvedTarget = LinkTarget.Blank;
			}

			switch (type as ContentPickerType) {
				case ContentPickerType.INTERNAL_LINK:
				case ContentPickerType.CONTENT_PAGE:
				case ContentPickerType.PROJECTS: {
					return renderLink(String(value), resolvedTarget);
				}
				case ContentPickerType.COLLECTION: {
					const collectionUrl = buildLink(APP_PATH.COLLECTION_DETAIL.route, {
						id: value as string,
					});
					return renderLink(collectionUrl, resolvedTarget);
				}
				case ContentPickerType.ITEM: {
					const itemUrl = buildLink(APP_PATH.ITEM_DETAIL.route, {
						id: value,
					});
					return renderLink(itemUrl, resolvedTarget);
				}
				case ContentPickerType.BUNDLE: {
					const bundleUrl = buildLink(BUNDLE_PATH.BUNDLE_DETAIL, {
						id: value,
					});
					return renderLink(bundleUrl, resolvedTarget);
				}
				case ContentPickerType.EXTERNAL_LINK: {
					const externalUrl = ((value as string) || '').replace(
						'{{PROXY_URL}}',
						Config.getConfig().database.proxyUrl || ''
					);
					return renderLink(externalUrl, resolvedTarget);
				}
				case ContentPickerType.ANCHOR_LINK: {
					const urlWithoutQueryOrAnchor = window.location.href
						.split('?')[0]
						.split('#')[0];
					return renderLink(`${urlWithoutQueryOrAnchor}#${value}`, resolvedTarget);
				}
				case ContentPickerType.FILE: {
					return renderLink(value as string, LinkTarget.Blank);
				}
				case ContentPickerType.SEARCH_QUERY: {
					const queryParams = JSON.parse(value as string);
					return renderLink(
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
						resolvedTarget
					);
				}
				default:
					break;
			}
		}
		return <>{children}</>;
	};

	return renderSmartLink();
};

export default SmartLink;
