import { Modal, ModalBody } from '@viaa/avo2-components';
import type { FunctionComponent, ReactElement } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { IeObjectFlowPlayerWrapper } from '~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper.tsx';
import { IeObjectMetadata } from '~modules/content-page/components/IeObjectMetadata/IeObjectMetadata.tsx';
import { isAudioVideoFormat } from '~shared/helpers/is-audio-video-format.ts';
import { tText } from '~shared/helpers/translation-functions';
import type { UnsavedPlayableDisplayDataObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { HET_ARCHIEF } from '~shared/types';
import { useGetDriekeuzespelerPlayableObject } from './hooks/useGetDriekeuzespelerPlayableObject';

import './BlockDriekeuzespelerModal.scss';

export interface BlockDriekeuzespelerModalProps {
	/** The interest whose tile was opened, or null when the modal is closed. */
	interest: { name: string; mediaItem?: { value?: string }; themeId: string } | null;
	/** Id of the content block, so the proxy can check the object is one this block references. */
	blockId?: string;
	/** Objects of a block that has not been saved yet, for the content page editor. */
	unsavedObjects?: UnsavedPlayableDisplayDataObject[];
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
	blockId,
	unsavedObjects,
	onClose,
}): ReactElement => {
	const isOpen = !!interest;
	// The host's IIIF viewer, if it registered one. Read per render rather than at module load, so a
	// config set up after this module is imported is still picked up.
	const IiifViewer = AdminConfigManager.getConfig().components.iiifViewer;
	const { data: ieObject, isFetching } = useGetDriekeuzespelerPlayableObject(
		blockId,
		interest?.mediaItem?.value,
		unsavedObjects
	);

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

		// A newspaper opens in the IIIF viewer, as the FA asks. The viewer needs the object's page list
		// and a ticket-service token per page, so it is injected by the host rather than living here.
		// https://meemoo.atlassian.net/browse/ARC-3813
		if (IiifViewer) {
			return (
				<div className="c-driekeuzespeler-modal__iiif-viewer">
					<IiifViewer schemaIdentifier={ieObject.schemaIdentifier} title={ieObject.name} />
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
			size="large"
			scrollable={false}
			onClose={onClose}
			className="c-driekeuzespeler-modal"
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
					/>
				)}

				{/* TODO(ARC-3813): the secondary CTA "Toon meer over [thema]" is not rendered yet. It has
				    to link to the search page with this interest's theme filter active, and that filter
				    does not exist: see goal 2b in the plan. Rendering a link with no working target would
				    be worse than leaving it out. The theme name itself is resolvable through
				    ThemesService.fetchThemesByIds once there is somewhere to point it. */}
			</ModalBody>
		</Modal>
	);
};
