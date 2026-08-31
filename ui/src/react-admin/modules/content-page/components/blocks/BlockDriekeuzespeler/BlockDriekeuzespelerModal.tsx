import { Modal, ModalBody } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import type { FunctionComponent, ReactElement } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { IeObjectFlowPlayerWrapper } from '~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper.tsx';
import { IeObjectMetadata } from '~modules/content-page/components/IeObjectMetadata/IeObjectMetadata.tsx';
import { useGetIeObjectsByIds } from '~modules/content-page/hooks/useGetIeObjectsByIds';
import { Locale } from '~modules/translations/translations.core.types.ts';
import { SmartLink } from '~shared/components/SmartLink/SmartLink.tsx';
import { isAudioVideoFormat } from '~shared/helpers/is-audio-video-format.ts';
import { tText } from '~shared/helpers/translation-functions';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import type { Theme } from '~shared/services/themes-service/themes.types';
import { HET_ARCHIEF } from '~shared/types';

import './BlockDriekeuzespelerModal.scss';

export interface BlockDriekeuzespelerModalProps {
	/** The interest whose tile was opened, or null when the modal is closed. */
	interest: {
		name: string;
	} | null;
	/** The interest's object, already resolved by the parent along with the rest of the block. */
	ieObject?: PlayableDisplayIeObject;
	/** The interest's theme: the block config only stores its id, and the CTA needs name and slug. */
	theme?: Theme;
	/** Whether the parent's fetch for the block's objects is still in flight. */
	isFetching: boolean;
	onClose: () => void;
}

/**
 * Plays the object behind one interest, on top of the page. The visitor is never navigated
 * anywhere, and closing returns to the same three tiles.
 *
 * https://meemoo.atlassian.net/browse/ARC-3813
 */
export const BlockDriekeuzespelerModal: FunctionComponent<BlockDriekeuzespelerModalProps> = ({
	interest,
	ieObject,
	theme,
	isFetching,
	onClose,
}): ReactElement => {
	const isOpen = !!interest;
	// Read per render rather than at module load, so a config set up after this module is imported
	// is still picked up.
	const IiifViewer = AdminConfigManager.getConfig().components.iiifViewer;

	const locale = AdminConfigManager.getConfig().locale || Locale.Nl;
	const themeName = locale === Locale.En ? theme?.nameEn : theme?.nameNl;

	// Only a multi-page object opens in the viewer, and the viewer is handed the whole object rather
	// than an id to go and resolve itself. Playable display data is cut to what a block renders and
	// carries no page list, so the object comes off the general ie-objects endpoint -- and only once
	// a newspaper is actually opened, not for every tile.
	const opensInViewer = !!IiifViewer && !!ieObject && !isAudioVideoFormat(ieObject.dctermsFormat);
	const { data: ieObjectsById, isFetching: isFetchingIeObject } = useGetIeObjectsByIds(
		ieObject ? [ieObject.schemaIdentifier] : [],
		isOpen && opensInViewer
	);
	const viewerIeObject = ieObject ? ieObjectsById?.[ieObject.schemaIdentifier] : undefined;

	// Only mount the player while the modal is open, so closing stops playback outright instead of
	// leaving audio running behind the page.
	const renderMedia = (): ReactElement | null => {
		if (!ieObject) {
			return null;
		}

		if (isAudioVideoFormat(ieObject.dctermsFormat)) {
			return (
				<IeObjectFlowPlayerWrapper
					ieObject={ieObject}
					title={ieObject.name}
					className="c-driekeuzespeler-modal__player"
				/>
			);
		}

		// A newspaper opens in the IIIF viewer, as the FA asks. The host still resolves a
		// ticket-service token per page, which is why the viewer itself is injected rather than
		// living here.
		if (IiifViewer && viewerIeObject) {
			return (
				<div className="c-driekeuzespeler-modal__iiif-viewer">
					<IiifViewer ieObject={viewerIeObject} title={ieObject.name} />
				</div>
			);
		}

		// No viewer configured, so fall back to the flat IIIF detail image the timeline and carousel
		// blocks show.
		if (ieObject.newspaperImage) {
			return (
				<img
					className="c-driekeuzespeler-modal__newspaper"
					src={ieObject.newspaperImage}
					alt={ieObject.name}
				/>
			);
		}

		return null;
	};

	return (
		<Modal
			isOpen={isOpen}
			size="extra-large"
			// A tall object (a portrait newspaper, or a player reporting a big intrinsic size) would
			// otherwise push the metadata card and its theme CTA off a phone screen with no way back.
			scrollable
			onClose={onClose}
			className="c-driekeuzespeler-modal"
			// The FA's video-first look: no visible title bar, just the close button floating over the
			// media. The title itself stays -- visually hidden in the stylesheet -- so the dialog still
			// has an accessible name.
			borderless
			title={
				interest
					? tText(
							'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___object-over-interest',
							{ interest: interest.name },
							[HET_ARCHIEF]
						)
					: undefined
			}
		>
			<ModalBody>
				<div className="c-driekeuzespeler-modal__media">
					{isFetching || isFetchingIeObject ? (
						// The FA asks for dynamic content a screen reader picks up, so the wait is announced
						// instead of only drawn. `output` carries the status role on its own.
						<output className="c-driekeuzespeler-modal__loading" aria-live="polite">
							{tText(
								'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___bezig-met-laden',
								undefined,
								[HET_ARCHIEF]
							)}
						</output>
					) : (
						renderMedia()
					)}
				</div>

				{!!ieObject && (
					<IeObjectMetadata
						ieObject={ieObject}
						fallbackTitle={interest?.name || ''}
						className="c-driekeuzespeler-modal__metadata"
						secondaryCta={
							themeName && theme ? (
								<SmartLink
									action={{
										type: AvoCoreContentPickerType.INTERNAL_LINK,
										value: stringifyUrl({
											url: AdminConfigManager.getConfig().routes.SEARCH || '/zoeken',
											query: { thema: theme.slug },
										}),
									}}
									className="c-driekeuzespeler-modal__theme-cta"
								>
									{tText(
										'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___toon-meer-over-thema',
										{ theme: themeName },
										[HET_ARCHIEF]
									)}
								</SmartLink>
							) : undefined
						}
					/>
				)}
			</ModalBody>
		</Modal>
	);
};
