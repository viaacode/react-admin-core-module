import { Modal, ModalBody } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import type { FunctionComponent, ReactElement } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { IeObjectFlowPlayerWrapper } from '~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper.tsx';
import { IeObjectMetadata } from '~modules/content-page/components/IeObjectMetadata/IeObjectMetadata.tsx';
import { Locale } from '~modules/translations/translations.core.types.ts';
import { SmartLink } from '~shared/components/SmartLink/SmartLink.tsx';
import { isAudioVideoFormat } from '~shared/helpers/is-audio-video-format.ts';
import { tText } from '~shared/helpers/translation-functions';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { HET_ARCHIEF } from '~shared/types';
import { useGetThemesByIds } from '../BlockOverviewThemes/hooks/useGetThemesByIds';

import './BlockDriekeuzespelerModal.scss';

export interface BlockDriekeuzespelerModalProps {
	/** The interest whose tile was opened, or null when the modal is closed. */
	interest: {
		name: string;
		mediaItem?: { value?: string };
		theme?: { value?: string };
	} | null;
	/** The interest's object, already resolved by the parent along with the rest of the selection. */
	ieObject?: PlayableDisplayIeObject;
	/** Whether the parent's proactive fetch for the current selection is still in flight. */
	isFetching: boolean;
	onClose: () => void;
}

/**
 * Plays the object behind one interest, on top of the page. The visitor is never navigated
 * anywhere, and closing returns to the same three tiles.
 *
 * https://meemoo.atlassian.net/wiki/spaces/HA2/pages/6218383419
 */
export const BlockDriekeuzespelerModal: FunctionComponent<BlockDriekeuzespelerModalProps> = ({
	interest,
	ieObject,
	isFetching,
	onClose,
}): ReactElement => {
	const isOpen = !!interest;
	// The host's IIIF viewer, if it registered one. Read per render rather than at module load, so a
	// config set up after this module is imported is still picked up.
	const IiifViewer = AdminConfigManager.getConfig().components.iiifViewer;

	// Resolves the interest's theme for the secondary CTA, in the name and slug fields -- not just
	// the id the block config stores.
	const { data: themes } = useGetThemesByIds(interest?.theme?.value ? [interest.theme.value] : []);
	const theme = themes?.[0];
	const locale = AdminConfigManager.getConfig().locale || Locale.Nl;
	const themeName = theme ? (locale === Locale.Nl ? theme.nameNl : theme.nameEn) : '';

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

		// A newspaper opens in the IIIF viewer, as the FA asks. It still needs a ticket-service token
		// per page (short-lived and access-checked at request time, so it can't travel with the rest
		// of this already-fetched object), so the viewer itself is injected by the host rather than
		// living here -- but its page list came along with everything else this modal proactively
		// fetched, so passing it through here saves the host from re-fetching the object just to
		// rebuild a list it already had. https://meemoo.atlassian.net/browse/ARC-3813
		if (IiifViewer) {
			return (
				<div className="c-driekeuzespeler-modal__iiif-viewer">
					<IiifViewer
						schemaIdentifier={ieObject.schemaIdentifier}
						title={ieObject.name}
						pages={ieObject.pages}
					/>
				</div>
			);
		}

		// No viewer configured, so fall back to the flat IIIF detail image the timeline and carousel
		// blocks show. A newspaper comes back as a self-contained data uri.
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
			scrollable={false}
			onClose={onClose}
			className="c-driekeuzespeler-modal"
			// The FA's video-first look: no visible title bar, just the close button floating over the
			// media, and a darker backdrop than the rest of the app's modals use. The title itself stays
			// -- visually hidden in the stylesheet -- so the dialog still has an accessible name.
			// https://www.figma.com/design/1yUd3vpjHXcMfI15dTeVYC/hetarchief.be-%E2%80%94-ontdekken?node-id=2354-4569
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
					{isFetching ? (
						// The FA asks for dynamic content a screen reader picks up, so the wait is announced
						// instead of only drawn. `output` carries the status role on its own, which is how
						// BlockObjectsGrid does it too.
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
							// The search page has no theme filter yet to point this at -- see
							// https://meemoo.atlassian.net/wiki/x/dYStdQE -- so this is a placeholder link, on
							// the URL param shape that FA describes ("Thema als URL parameter"). Swap the path
							// below for the real search route once that filter ships; nothing else about this
							// CTA should need to change.
							themeName ? (
								<SmartLink
									action={{
										type: AvoCoreContentPickerType.INTERNAL_LINK,
										value: `/zoeken?thema=${theme?.slug}`,
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
