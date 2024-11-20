import { Button, ButtonToolbar, Modal, ModalBody } from '@viaa/avo2-components';
import type { FunctionComponent, ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import { tText } from '~shared/helpers/translation-functions';
import { ProgressBar } from '@meemoo/react-components';
import './ExportAllToCsvModal.scss';
import FileSaver from 'file-saver';
import { reactNodeToString } from '~shared/helpers/react-node-to-string';
import { noop, times } from 'lodash-es';
import { showToast } from '~shared/helpers/show-toast';
import { ToastType } from '~core/config';
import { delay, mapLimit } from 'blend-promise-utils';

const ITEMS_PER_REQUEST = 500;
const PARALLEL_REQUESTS = 10;

interface ExportAllToCsvModalProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
	fetchingItemsLabel: string;
	generatingCsvLabel: string;
	fetchTotalItems: () => Promise<number>;
	fetchMoreItems: (offset: number, limit: number) => Promise<any>;
	renderValue: (item: any, columnId: string) => string | ReactNode;
	columns: { label: string; id: string }[];
	exportFileName: string;
}

export const ExportAllToCsvModal: FunctionComponent<ExportAllToCsvModalProps> = ({
	title,
	isOpen,
	onClose,
	fetchingItemsLabel,
	generatingCsvLabel,
	fetchTotalItems,
	fetchMoreItems,
	renderValue,
	columns,
	exportFileName,
}) => {
	const abortRef = React.useRef(false);

	const [currentOffset, setCurrentOffset] = useState(0);
	const [total, setTotal] = useState<number | null>(null);
	const [csvBlob, setCsvBlob] = useState<Blob | null>(null);
	const [percentageConvertedToCsv, setPercentageConvertedToCsv] = useState(0);

	/**
	 * Convert the downloaded items to a csv blob, which can be downloaded instantly
	 * @param downloadedItems
	 */
	const convertDownloadedItemsToCsvBlob = async (downloadedItems: any[]) => {
		const csvRowValues: string[] = [columns.map((c) => c.label).join(';') + '\n'];
		let lastCsvConvertPercentage = 0;
		for (let index = 0; index < downloadedItems.length; index++) {
			if (abortRef.current) {
				showToast({
					title: tText(
						'modules/shared/components/export-all-to-csv-modal/export-all-to-csv-modal___exporteren-geannuleerd'
					),
					type: ToastType.INFO,
				});
				break;
			}
			const item = downloadedItems[index];
			// Round to multiple of 10 to have less overhead of UI rerendering
			const csvConvertPercentage = Math.round((index / downloadedItems.length) * 10) * 10;
			if (csvConvertPercentage !== lastCsvConvertPercentage) {
				setPercentageConvertedToCsv(csvConvertPercentage);
				lastCsvConvertPercentage = csvConvertPercentage;
				await delay(0); // Give react time to update the ui
			}
			const csvCellValues: string[] = [];
			columns.forEach(({ id: columnId }) => {
				// We're using the same render function as the admin dashboard table to render the values
				// This way we can be sure the values are formatted the same way in the csv as in the table
				const csvCellValue = reactNodeToString(renderValue(item, columnId)).replace(
					/"/g,
					'""'
				);
				if (!csvCellValue || csvCellValue === '-') {
					csvCellValues.push('');
				} else {
					csvCellValues.push(`"${csvCellValue}"`);
				}
			});
			csvRowValues.push(csvCellValues.join(';') + '\n');
		}
		setPercentageConvertedToCsv(100);
		return new Blob(csvRowValues, { type: 'text/csv;charset=utf-8' });
	};

	/**
	 * Fetch all items in a loop page by page and update the progress in between fetch calls
	 */
	const fetchItems = async () => {
		const totalItems = await fetchTotalItems();
		setTotal(totalItems);
		const downloadedItems: any[] = [];
		await mapLimit(
			times(Math.ceil(totalItems / ITEMS_PER_REQUEST)),
			PARALLEL_REQUESTS,
			async (offset) => {
				const newItems = await fetchMoreItems(offset, ITEMS_PER_REQUEST);
				downloadedItems.push(...newItems);
				setCurrentOffset(offset);
			}
		);
		setCurrentOffset(totalItems);
		setCsvBlob(await convertDownloadedItemsToCsvBlob(downloadedItems));
	};

	const resetModal = () => {
		setCurrentOffset(0);
		setTotal(null);
		setPercentageConvertedToCsv(0);
		setCsvBlob(null);
	};

	/**
	 * When the modal opens, start fetching all the items and convert them to csv format
	 */
	useEffect(() => {
		if (isOpen) {
			abortRef.current = false;
			resetModal();
			fetchItems().then(noop);
		}
		// We only want to execute the fetching of all the items once when the modal is opened
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	/**
	 * Convert all the downloaded items to csv strings and download them as a csv file
	 */
	const handleDownloadCsv = () => {
		if (!csvBlob) {
			showToast({
				title: tText(
					'modules/shared/components/export-all-to-csv-modal/export-all-to-csv-modal___het-genereren-van-de-csv-is-mislukt'
				),
				type: ToastType.ERROR,
			});
			return;
		}
		FileSaver.saveAs(csvBlob, exportFileName.replace(/[*\s]+/, ''));
	};

	/**
	 * Interrupt the download for loop and reset the modal
	 */
	const handleAbort = () => {
		abortRef.current = true;
		resetModal();
		onClose();
		// Reload window to force promise cancellation of blend.mapLimit
		window.location.reload();
	};

	const renderProgressLabel = (
		total: number | null,
		currentItems: number,
		fetchingItemsLabel: string
	) => {
		if (percentageDownloaded < 100) {
			return (
				<span>
					{fetchingItemsLabel}: {currentItems} / {total || '???'}
				</span>
			);
		} else if (percentageDownloaded === 100 && percentageConvertedToCsv !== 100) {
			return <span>{generatingCsvLabel}</span>;
		} else if (totalPercentage === 100) {
			return (
				<span>
					{tText(
						'modules/shared/components/export-all-to-csv-modal/export-all-to-csv-modal___de-csv-is-klaar-om-te-downloaden'
					)}
				</span>
			);
		}
	};

	const currentItems = Math.min(currentOffset, total || Infinity);
	const percentageDownloaded = total ? (currentItems / total) * 100 : 0;
	const totalPercentage = Math.round((percentageDownloaded + percentageConvertedToCsv) / 2);
	return (
		<Modal
			isOpen={isOpen}
			title={title}
			size="small"
			onClose={handleAbort}
			className="c-export-all-to-csv-modal"
		>
			<ModalBody>
				<div className="c-export-all-to-csv-modal__body">
					{renderProgressLabel(total, currentItems, fetchingItemsLabel)}
					<ProgressBar percentage={totalPercentage}></ProgressBar>
				</div>

				<ButtonToolbar>
					<Button
						type="secondary"
						label={tText(
							'modules/shared/components/export-all-to-csv-modal/export-all-to-csv-modal___annuleren'
						)}
						onClick={handleAbort}
					/>
					<Button
						type="primary"
						label={tText(
							'modules/shared/components/export-all-to-csv-modal/export-all-to-csv-modal___download-csv'
						)}
						onClick={handleDownloadCsv}
						disabled={totalPercentage !== 100}
					/>
				</ButtonToolbar>
			</ModalBody>
		</Modal>
	);
};
