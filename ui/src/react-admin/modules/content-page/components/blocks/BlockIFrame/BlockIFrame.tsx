import type { VideoAspectRatio } from '@viaa/avo2-components';
import { AspectRatioWrapper, Button } from '@viaa/avo2-components';
import type { FunctionComponent, IframeHTMLAttributes } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { type CookieConsentCategory, openCookieConsentDialog } from '~shared/helpers/cookiebot';
import { tText } from '~shared/helpers/translation-functions';
import { useCookieConsent } from '~shared/hooks/useCookieConsent';

import './BlockIFrame.scss';

export interface BlockIFrameProps extends IframeHTMLAttributes<HTMLIFrameElement> {
	title: string;
	ratio?: VideoAspectRatio;
}

/**
 * Iframe hosts that set cookies, with the cookie categories the user needs to accept before we load them
 * Same categories as Cookiebot uses for these hosts in its auto blocking mode
 */
const IFRAME_HOSTS_REQUIRING_CONSENT: { hosts: string[]; categories: CookieConsentCategory[] }[] = [
	{
		hosts: ['vimeo.com'],
		categories: ['statistics', 'marketing'],
	},
	{
		hosts: ['youtube.com', 'youtube-nocookie.com', 'youtu.be'],
		categories: ['statistics', 'marketing'],
	},
];

/**
 * Urls without a protocol are loaded with the protocol of the page
 */
function addProtocolIfMissing(src: string | undefined): string | undefined {
	if (src && !/^(http:|https:)?\/\//.test(src)) {
		return `//${src}`;
	}
	return src;
}

function getHostname(src: string | undefined): string | null {
	if (!src) {
		return null;
	}
	try {
		return new URL(src, 'https://example.com').hostname;
	} catch (_err) {
		return null;
	}
}

export function getRequiredCookieConsent(src: string | undefined): CookieConsentCategory[] {
	const hostname = getHostname(addProtocolIfMissing(src));
	if (!hostname) {
		return [];
	}
	return (
		IFRAME_HOSTS_REQUIRING_CONSENT.find(({ hosts }) =>
			hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))
		)?.categories || []
	);
}

/**
 * 3rd party embeds that set cookies (eg: vimeo) are only loaded after the user accepted the needed cookies in Cookiebot.
 * Cookiebot auto blocking only blocks iframes in the html of the first page load, not iframes react renders afterwards (eg: after a client side navigation).
 * So these iframes are only rendered in the browser, after we checked the consent ourselves.
 * https://meemoo.atlassian.net/browse/ARC-4209
 */
export const BlockIFrame: FunctionComponent<BlockIFrameProps> = ({
	title,
	ratio,
	allowFullScreen = true,
	frameBorder = 0,
	...iframeProps
}) => {
	const src = addProtocolIfMissing(iframeProps.src);
	const hasConsent = useCookieConsent(getRequiredCookieConsent(src));

	let aspectRatio: VideoAspectRatio | number | undefined;
	try {
		aspectRatio =
			ratio ||
			Number.parseInt(String(iframeProps.width), 10) /
				Number.parseInt(String(iframeProps.height), 10);
	} catch (_err) {
		aspectRatio = ratio;
	}

	if (!hasConsent) {
		return (
			<AspectRatioWrapper
				aspect={aspectRatio}
				className="c-block-iframe c-block-iframe--no-consent"
			>
				{hasConsent === false && (
					<div className="c-block-iframe__consent-message">
						<p>
							{tText(
								'modules/content-page/components/blocks/block-i-frame/block-i-frame___deze-inhoud-wordt-aangeboden-door-een-externe-dienst-aanvaard-de-statistische-en-marketing-cookies-om-ze-te-bekijken'
							)}
						</p>
						<Button
							type="secondary"
							label={tText(
								'modules/content-page/components/blocks/block-i-frame/block-i-frame___cookie-instellingen-aanpassen'
							)}
							onClick={() => openCookieConsentDialog(AdminConfigManager.getConfig().locale)}
						/>
					</div>
				)}
			</AspectRatioWrapper>
		);
	}

	return (
		<AspectRatioWrapper aspect={aspectRatio} className="c-block-iframe">
			<iframe
				title={title}
				allowFullScreen={allowFullScreen}
				frameBorder={frameBorder}
				{...iframeProps}
				src={src}
			/>
		</AspectRatioWrapper>
	);
};
