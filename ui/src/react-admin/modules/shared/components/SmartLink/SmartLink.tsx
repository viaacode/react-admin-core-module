import { ButtonAction, LinkTarget } from '@viaa/avo2-components';
import clsx from 'clsx';
import { fromPairs, map } from 'lodash-es';
import { stringify } from 'query-string';
import React, { FunctionComponent, ReactElement, ReactNode } from 'react';

import { AdminConfigManager } from '~core/config';
import { buildLink } from '~shared/helpers/link';
import { insideIframe } from '../../helpers/inside-iframe';
import type { Avo } from '@viaa/avo2-types';
import { Link } from '../Link';

export interface SmartLinkProps {
	action?: ButtonAction | null;
	removeStyles?: boolean;
	title?: string;
	className?: string;
	children: ReactNode;
}

const SmartLink: FunctionComponent<SmartLinkProps> = ({
	action,
	removeStyles = true,
	title,
	children,
	className,
}) => {
	const renderLink = (
		url: string,
		target: LinkTarget = LinkTarget.Self,
		anchor?: boolean
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
							className={clsx(className, { 'a-link__no-styles': removeStyles })}
							title={title}
							onClick={() =>
								AdminConfigManager.getConfig().handlers.onExternalLink(fullUrl)
							}
						>
							{children}
						</a>
					);
				}
				// relative url
				return (
					<Link
						to={fullUrl}
						className={clsx(className, { 'a-link__no-styles': removeStyles })}
						onClick={() => {
							AdminConfigManager.getConfig().handlers.onExternalLink(fullUrl);
							!anchor && scrollTo({ top: 0 });
						}}
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
							className={clsx(className, { 'a-link__no-styles': removeStyles })}
							onClick={() =>
								AdminConfigManager.getConfig().handlers.onExternalLink(fullUrl)
							}
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
						className={clsx(className, { 'a-link__no-styles': removeStyles })}
						onClick={() =>
							AdminConfigManager.getConfig().handlers.onExternalLink(fullUrl)
						}
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

			switch (type as Avo.Core.ContentPickerType) {
				case 'INTERNAL_LINK':
				case 'CONTENT_PAGE':
				case 'PROJECTS': {
					return renderLink(String(value), resolvedTarget);
				}

				case 'COLLECTION': {
					const collectionUrl = buildLink(
						AdminConfigManager.getAdminRoute('COLLECTION_DETAIL'),
						{
							id: value as string,
						}
					);
					return renderLink(collectionUrl, resolvedTarget);
				}

				case 'ITEM': {
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
					const assignmentUrl = buildLink(
						AdminConfigManager.getAdminRoute('ASSIGNMENT_DETAIL'),
						{
							id: value,
						}
					);
					return renderLink(assignmentUrl, resolvedTarget);
				}

				case 'EXTERNAL_LINK': {
					const externalUrl = ((value as string) || '').replace(
						'{{PROXY_URL}}',
						AdminConfigManager.getConfig().database.proxyUrl || ''
					);
					return renderLink(externalUrl, resolvedTarget);
				}

				case 'ANCHOR_LINK': {
					const urlWithoutQueryOrAnchor = window.location.href
						.split('?')[0]
						.split('#')[0];
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

export const generateSmartLink = (
	action: ButtonAction | null | undefined,
	children: ReactNode,
	title?: string
): ReactElement<any, any> | null => {
	return (
		<SmartLink action={action} title={title}>
			{children}
		</SmartLink>
	);
};
