import type { ButtonAction } from '@viaa/avo2-components';
import type { AvoCoreContentPickerType } from '@viaa/avo2-types';
import clsx from 'clsx';
import { map } from 'es-toolkit/compat';
import { stringify } from 'query-string';
import type { FunctionComponent, ReactElement, ReactNode } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { isServerSideRendering } from '~shared/helpers/routing/is-server-side-rendering';
import { buildLink } from '~shared/helpers/routing/link';
import { isInsideIframe } from '../../helpers/routing/is-inside-iframe';
import { Link } from '../Link/Link';
import { LinkTarget } from './SmartLink.types';

export interface SmartLinkProps {
	action?: ButtonAction | null;
	removeStyles?: boolean;
	title?: string;
	ariaLabel?: string;
	className?: string;
	children: ReactNode;
}

export const SmartLink: FunctionComponent<SmartLinkProps> = ({
	action,
	removeStyles = true,
	title,
	children,
	className,
	ariaLabel,
}) => {
	const renderLink = (
		url: string,
		target: LinkTarget = LinkTarget.Self,
		anchor?: boolean
		// biome-ignore lint/suspicious/noExplicitAny: todo
	): ReactElement<any, any> | null => {
		let fullUrl = url;
		if (url.startsWith('www.')) {
			fullUrl = `//${url}`;
		}
		const clientUrl = AdminConfigManager.getConfig().env.CLIENT_URL;
		const clientUrlWithoutProtocol = AdminConfigManager.getConfig().env.CLIENT_URL.replace(
			/https?:\/\//,
			''
		);
		if (fullUrl.startsWith(clientUrl)) {
			fullUrl = fullUrl.replace(clientUrl, '');
		}
		if (fullUrl.startsWith(clientUrlWithoutProtocol)) {
			fullUrl = fullUrl.replace(clientUrlWithoutProtocol, '');
		}

		switch (target) {
			case LinkTarget.Self:
				// Open inside same tab
				if (fullUrl.includes('//')) {
					// absolute url
					return (
						<a
							href={fullUrl}
							target={LinkTarget.Self}
							title={title}
							aria-label={ariaLabel}
							className={clsx(className, { 'a-link__no-styles': removeStyles })}
							onClick={() => AdminConfigManager.getConfig().handlers.onExternalLink(fullUrl)}
						>
							{children}
						</a>
					);
				}
				// relative url
				return (
					<Link
						to={fullUrl}
						target={LinkTarget.Self}
						title={title}
						aria-label={ariaLabel}
						className={clsx(className, { 'a-link__no-styles': removeStyles })}
						onClick={(_evt) => {
							AdminConfigManager.getConfig().handlers.onExternalLink(fullUrl);
							if (anchor) {
								const anchorId = fullUrl.split('#')[1];
								document.getElementById(anchorId)?.scrollIntoView({ behavior: 'instant' });
							} else {
								scrollTo({ top: 0 });
							}
						}}
					>
						{children}
					</Link>
				);
			default:
				// Open in a new tab
				if (fullUrl.includes('//')) {
					// absolute fullUrl
					return (
						<a
							href={fullUrl}
							target={LinkTarget.Blank}
							rel="noopener noreferrer"
							title={title}
							className={clsx(className, { 'a-link__no-styles': removeStyles })}
							onClick={() => AdminConfigManager.getConfig().handlers.onExternalLink(fullUrl)}
						>
							{children}
						</a>
					);
				}
				// relative url
				return (
					<a
						href={`${AdminConfigManager.getConfig().env.CLIENT_URL}${fullUrl}`}
						target={LinkTarget.Blank}
						rel="noopener noreferrer"
						title={title}
						className={clsx(className, { 'a-link__no-styles': removeStyles })}
						onClick={() => AdminConfigManager.getConfig().handlers.onExternalLink(fullUrl)}
					>
						{children}
					</a>
				);
		}
	};

	// biome-ignore lint/suspicious/noExplicitAny: todo
	const renderSmartLink = (): ReactElement<any, any> | null => {
		if (action) {
			const { type, value, target } = action;

			if (!value) {
				return <>{children}</>;
			}

			let resolvedTarget = target;
			if (!isServerSideRendering() && isInsideIframe()) {
				// Klaar page inside smartschool iframe must open all links in new window: https://meemoo.atlassian.net/browse/AVO-1354
				resolvedTarget = LinkTarget.Blank;
			}

			switch (type as AvoCoreContentPickerType) {
				case 'INTERNAL_LINK':
				case 'CONTENT_PAGE':
				case 'CONTENT_PAGE_NEWS_ITEM':
				case 'CONTENT_PAGE_PAGE':
				case 'CONTENT_PAGE_PROJECT':
				case 'CONTENT_PAGE_OVERVIEW':
				case 'CONTENT_PAGE_DOMAIN_DETAIL':
				case 'CONTENT_PAGE_EVENT_DETAIL':
				case 'CONTENT_PAGE_SCREENCAST':
				case 'PROJECTS': {
					return renderLink(String(value), resolvedTarget);
				}

				case 'COLLECTION': {
					const collectionUrl = buildLink(AdminConfigManager.getAdminRoute('COLLECTION_DETAIL'), {
						id: value as string,
					});
					return renderLink(collectionUrl, resolvedTarget);
				}

				case 'ITEM':
				case 'ITEM_WITH_CUE_POINTS': {
					const itemUrl = buildLink(AdminConfigManager.getAdminRoute('ITEM_DETAIL'), {
						id: value,
					});
					return renderLink(itemUrl, resolvedTarget);
				}

				case 'BUNDLE': {
					const bundleUrl = buildLink(AdminConfigManager.getAdminRoute('BUNDLE_DETAIL'), {
						id: value,
					});
					return renderLink(bundleUrl, resolvedTarget);
				}

				case 'ASSIGNMENT': {
					const assignmentUrl = buildLink(AdminConfigManager.getAdminRoute('ASSIGNMENT_DETAIL'), {
						id: value,
					});
					return renderLink(assignmentUrl, resolvedTarget);
				}

				case 'EXTERNAL_LINK': {
					const externalUrl = ((value as string) || '').replace(
						'{{PROXY_URL}}',
						getAdminCoreApiUrl() || ''
					);
					return renderLink(externalUrl, resolvedTarget);
				}

				case 'ANCHOR_LINK': {
					const urlWithoutQueryOrAnchor = window.location.href.split('?')[0].split('#')[0];
					return renderLink(`${urlWithoutQueryOrAnchor}#${value}`, resolvedTarget, true);
				}

				case 'FILE': {
					return renderLink(value as string, LinkTarget.Blank);
				}

				case 'SEARCH_QUERY': {
					const queryParams = JSON.parse(value as string);
					return renderLink(
						buildLink(
							AdminConfigManager.getAdminRoute('SEARCH'),
							{},
							stringify(
								Object.fromEntries(
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

export const generateSmartLink = (
	action: ButtonAction | null | undefined,
	children: ReactNode,
	title?: string,
	className?: string
	// biome-ignore lint/suspicious/noExplicitAny: todo
): ReactElement<any, any> | null => {
	return (
		<SmartLink
			action={action}
			title={title}
			className={className}
			key={`smart-link-${action?.value}-${title}-${className}`}
		>
			{children}
		</SmartLink>
	);
};
