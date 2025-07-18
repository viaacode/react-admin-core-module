import {
	Alert,
	Button,
	ButtonToolbar,
	Checkbox,
	Modal,
	ModalBody,
	ModalFooterRight,
	RadioButtonGroup,
	Spacer,
	Spinner,
	Toolbar,
	ToolbarItem,
	ToolbarRight,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import type { FunctionComponent, ReactNode } from 'react';
import React, { useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { Link } from '~modules/shared/components/Link';
import { ContentPicker } from '~shared/components/ContentPicker/ContentPicker';
import { GET_DELETE_RADIO_OPTIONS } from '~shared/consts/user.const';
import { CustomError } from '~shared/helpers/custom-error';
import { buildLink } from '~shared/helpers/link';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AVO } from '~shared/types';
import type { PickerItem } from '~shared/types/content-picker';
import { UserService } from '../user.service';
import type { DeleteContentCounts } from '../user.types';

import './UserDeleteModal.scss';

interface UserDeleteModalProps {
	selectedProfileIds: string[];
	isOpen: boolean;
	onClose: () => void;
	deleteCallback: () => void;
}

/**
 * Adds two modals:
 * - select delete option
 * - confirm modal
 */
const UserDeleteModal: FunctionComponent<UserDeleteModalProps> = ({
	selectedProfileIds,
	isOpen,
	onClose,
	deleteCallback,
}) => {
	const [transferToUser, setTransferToUser] = useState<PickerItem | null>(null);
	const [transferToUserError, setTransferToUserError] = useState<string | undefined>();
	const [selectedDeleteOption, setSelectedDeleteOption] =
		useState<Avo.User.UserDeleteOption>('DELETE_ALL');
	const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<boolean>(false);
	const [deleteContentCounts, setDeleteContentCounts] = useState<DeleteContentCounts | null>(null);
	const [shouldSendEmail, setShouldSendEmail] = useState<boolean>(false);

	const validateOptionModalAndOpenConfirm = async () => {
		try {
			if (
				(selectedDeleteOption === 'TRANSFER_PUBLIC' || selectedDeleteOption === 'TRANSFER_ALL') &&
				!transferToUser
			) {
				// transfer user was not selected, or transfer user is the same user as one of the user that will be deleted
				setTransferToUserError(
					tText(
						'admin/users/views/user-overview___kies-een-gebruiker-om-de-content-naar-over-te-dragen',
						undefined,
						[AVO]
					)
				);
				return;
			}
			if (
				(selectedDeleteOption === 'TRANSFER_PUBLIC' || selectedDeleteOption === 'TRANSFER_ALL') &&
				transferToUser &&
				selectedProfileIds.includes(transferToUser.value)
			) {
				// transfer user was not selected, or transfer user is the same user as one of the user that will be deleted
				setTransferToUserError(
					tText(
						'admin/users/views/user-overview___je-kan-geen-content-overdragen-naar-een-gebruiker-die-verwijdert-zal-worden',
						undefined,
						[AVO]
					)
				);
				return;
			}

			// Fetch counts to inform the user of what objects they are about to delete
			setDeleteContentCounts(await UserService.fetchPublicAndPrivateCounts(selectedProfileIds));
			onClose();
			setDeleteConfirmModalOpen(true);
		} catch (err) {
			console.error(
				new CustomError('Error during validateOptionModalAndOpenConfirm', err, {
					transferToUser,
					selectedDeleteOption,
					// selectedUsers: selectedProfileIds,
				})
			);
			showToast({
				title: tText('modules/user/components/user-delete-modal___error'),
				description: tText(
					'admin/users/views/user-overview___het-ophalen-van-de-content-items-voor-de-geselecteerde-gebruikers-is-mislukt',
					undefined,
					[AVO]
				),
				type: ToastType.ERROR,
			});
		}
	};

	const handleConfirmModalClose = () => {
		setDeleteConfirmModalOpen(false);
		setDeleteContentCounts(null);
		setSelectedDeleteOption('DELETE_ALL');
		setTransferToUser(null);
	};

	const renderConfirmDeleteMessage = () => {
		if (!deleteContentCounts) {
			return <Spinner></Spinner>;
		}

		const isDeleteAll = selectedDeleteOption === 'DELETE_ALL';
		const isTransferAll = selectedDeleteOption === 'TRANSFER_ALL';

		const countOutputs: ReactNode[] = [];
		if (isDeleteAll && deleteContentCounts.publicCollections) {
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute('ADMIN_COLLECTIONS_OVERVIEW'),
						{},
						{
							is_public: '1',
							owner_profile_id: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.publicCollections}{' '}
					{deleteContentCounts.publicCollections === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___publieke-collectie',
								undefined,
								[AVO]
							)
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___publieke-collecties',
								undefined,
								[AVO]
							)}
				</Link>
			);
		}
		if (!isTransferAll && deleteContentCounts.privateCollections) {
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute('ADMIN_COLLECTIONS_OVERVIEW'),
						{},
						{
							is_public: '0',
							owner_profile_id: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.privateCollections}{' '}
					{deleteContentCounts.privateCollections === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___prive-collectie',
								undefined,
								[AVO]
							)
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___prive-collecties',
								undefined,
								[AVO]
							)}
				</Link>
			);
		}
		if (isDeleteAll && deleteContentCounts.publicBundles) {
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute('ADMIN_BUNDLES_OVERVIEW'),
						{},
						{
							is_public: '1',
							owner_profile_id: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.publicBundles}{' '}
					{deleteContentCounts.publicBundles === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___publieke-bundel',
								undefined,
								[AVO]
							)
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___publieke-bundels',
								undefined,
								[AVO]
							)}
				</Link>
			);
		}
		if (!isTransferAll && deleteContentCounts.privateBundles) {
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute('ADMIN_BUNDLES_OVERVIEW'),
						{},
						{
							is_public: '0',
							owner_profile_id: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.privateBundles}{' '}
					{deleteContentCounts.privateBundles === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___prive-bundel',
								undefined,
								[AVO]
							)
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___prive-bundels',
								undefined,
								[AVO]
							)}
				</Link>
			);
		}
		if (isDeleteAll && deleteContentCounts.publicAssignments) {
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute('ADMIN_ASSIGNMENTS_OVERVIEW'),
						{},
						{
							is_public: '1',
							author: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.publicAssignments}{' '}
					{deleteContentCounts.publicAssignments === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___publieke-opdracht',
								undefined,
								[AVO]
							)
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___publieke-opdrachten',
								undefined,
								[AVO]
							)}
				</Link>
			);
		}
		if (
			isDeleteAll &&
			deleteContentCounts.publicAssignments &&
			deleteContentCounts.publicAssignmentPupilCollections
		) {
			const numberOfCollections = String(deleteContentCounts.publicAssignmentPupilCollections);
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute('ADMIN_ASSIGNMENT_PUPIL_COLLECTIONS_OVERVIEW'),
						{},
						{
							teacher: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.publicAssignmentPupilCollections === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___met-1-leerlingen-collectie',
								undefined,
								[AVO]
							)
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___met-number-of-collections-leerlingen-collecties',
								{
									numberOfCollections,
								},
								[AVO]
							)}
				</Link>
			);
		}
		if (!isTransferAll && deleteContentCounts.privateAssignments) {
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute('ADMIN_ASSIGNMENTS_OVERVIEW'),
						{},
						{
							is_public: '0',
							author: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.privateAssignments}{' '}
					{deleteContentCounts.privateAssignments === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___prive-opdracht',
								undefined,
								[AVO]
							)
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___prive-opdrachten',
								undefined,
								[AVO]
							)}
				</Link>
			);
		}
		if (
			isDeleteAll &&
			deleteContentCounts.privateAssignments &&
			deleteContentCounts.privateAssignmentPupilCollections
		) {
			const numberOfCollections = String(deleteContentCounts.privateAssignmentPupilCollections);
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute('ADMIN_ASSIGNMENT_PUPIL_COLLECTIONS_OVERVIEW'),
						{},
						{
							teacher: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.privateAssignmentPupilCollections === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___met-1-leerlingen-collectie',
								undefined,
								[AVO]
							)
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___met-number-of-collections-leerlingen-collecties',
								{
									numberOfCollections,
								},
								[AVO]
							)}
				</Link>
			);
		}
		if (isDeleteAll && deleteContentCounts.quickLanes) {
			countOutputs.push(
				<>
					{deleteContentCounts.quickLanes}{' '}
					{deleteContentCounts.quickLanes === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___sneldeel-link',
								undefined,
								[AVO]
							)
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___sneldeel-links',
								undefined,
								[AVO]
							)}
				</>
			);
		}
		if (isDeleteAll && deleteContentCounts.publicContentPages) {
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW'),
						{},
						{
							is_public: '1',
							user_profile_id: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.publicContentPages}{' '}
					{deleteContentCounts.publicContentPages === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___publieke-content-pagina'
							)
						: tHtml('admin/users/views/user-overview___publieke-content-paginas')}
				</Link>
			);
		}
		if (!isTransferAll && deleteContentCounts.privateContentPages) {
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW'),
						{},
						{
							is_public: '0',
							user_profile_id: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.privateContentPages}{' '}
					{deleteContentCounts.privateContentPages === 1
						? tHtml('react-admin/modules/user/components/user-delete-modal___prive-content-pagina')
						: tHtml('admin/users/views/user-overview___prive-content-paginas')}
				</Link>
			);
		}
		if (!isTransferAll && deleteContentCounts.bookmarks) {
			countOutputs.push(
				<>
					{deleteContentCounts.bookmarks}{' '}
					{deleteContentCounts.bookmarks === 1
						? tHtml('react-admin/modules/user/components/user-delete-modal___bladwijzer')
						: tHtml('admin/users/views/user-overview___bladwijzers')}
				</>
			);
		}
		return (
			<>
				{tHtml(
					'admin/users/views/user-overview___weet-je-zeker-dat-je-deze-gebruikers-wil-verwijderen'
				)}

				{!!countOutputs.length && (
					<Spacer margin="top" className="c-content">
						<strong>
							{tText(
								'react-admin/modules/user/components/user-delete-modal___deze-inhoud-zal-verwijderd-worden',
								undefined,
								[AVO]
							)}
						</strong>
						<ul>
							{countOutputs.map((count, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: We don't have a better key at this time
								<li key={`content-count-${index}`}>{count}</li>
							))}
						</ul>
					</Spacer>
				)}

				<Checkbox
					label={tText(
						'admin/users/components/user-delete-modal___breng-de-gebruiker-s-op-de-hoogte-van-deze-actie'
					)}
					checked={shouldSendEmail}
					onChange={setShouldSendEmail}
				/>
				<Spacer margin="top">
					<Alert
						message={tHtml(
							'admin/users/views/user-overview___deze-actie-kan-niet-ongedaan-gemaakt-worden'
						)}
						type="danger"
					/>
				</Spacer>
			</>
		);
	};

	const handleDeleteUsers = async () => {
		try {
			setDeleteConfirmModalOpen(false);
			setShouldSendEmail(false);
			await UserService.bulkDeleteUsers(
				selectedProfileIds,
				selectedDeleteOption,
				shouldSendEmail,
				transferToUser?.value
			);

			showToast({
				title: tText('modules/user/components/user-delete-modal___success'),
				description: tText('admin/users/views/user-edit___de-gebruiker-is-aangepast'),
				type: ToastType.SUCCESS,
			});
			deleteCallback();
		} catch (err) {
			console.error(new CustomError('Failed to remove users', err));
			showToast({
				title: tText('modules/user/components/user-delete-modal___error'),
				description: tText(
					'admin/users/views/user-overview___het-verwijderen-van-de-geselecteerde-gebruikers-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	return (
		<>
			<Modal
				title={tText('admin/users/views/user-overview___verwijder-opties', undefined, [AVO])}
				isOpen={isOpen}
				onClose={onClose}
				size="medium"
				className="c-user-delete-modal"
			>
				<ModalBody>
					<RadioButtonGroup
						options={GET_DELETE_RADIO_OPTIONS()}
						value={selectedDeleteOption}
						// biome-ignore lint/suspicious/noExplicitAny: todo
						onChange={setSelectedDeleteOption as any}
					/>
					{(selectedDeleteOption === 'TRANSFER_PUBLIC' ||
						selectedDeleteOption === 'TRANSFER_ALL') && (
						<ContentPicker
							allowedTypes={['PROFILE']}
							value={transferToUser}
							onChange={setTransferToUser}
							placeholder={tText(
								'admin/users/views/user-overview___overdragen-naar-gebruiker',
								undefined,
								[AVO]
							)}
							hideTargetSwitch
							hideTypeDropdown
							errors={transferToUserError ? [transferToUserError] : []}
						/>
					)}
				</ModalBody>
				<ModalFooterRight>
					<Toolbar>
						<ToolbarRight>
							<ToolbarItem>
								<ButtonToolbar>
									<Button
										type="secondary"
										label={tText(
											'admin/shared/components/change-labels-modal/change-labels-modal___annuleren'
										)}
										onClick={onClose}
									/>
									<Button
										type="danger"
										label={tText('admin/users/views/user-overview___verwijder-gebruikers')}
										onClick={validateOptionModalAndOpenConfirm}
									/>
								</ButtonToolbar>
							</ToolbarItem>
						</ToolbarRight>
					</Toolbar>
				</ModalFooterRight>
			</Modal>
			<Modal
				isOpen={deleteConfirmModalOpen}
				title={tText('admin/users/views/user-overview___bevestiging')}
				size="medium"
				onClose={handleConfirmModalClose}
				scrollable
				className="c-user-delete-modal"
			>
				<ModalBody>
					{renderConfirmDeleteMessage()}
					<Toolbar>
						<ToolbarRight>
							<ToolbarItem>
								<ButtonToolbar>
									<Button
										type="secondary"
										label={tText('admin/users/views/user-overview___annuleren')}
										onClick={handleConfirmModalClose}
									/>
									<Button
										type="danger"
										label={tText('admin/users/views/user-overview___verwijder-gebruikers')}
										onClick={handleDeleteUsers}
									/>
								</ButtonToolbar>
							</ToolbarItem>
						</ToolbarRight>
					</Toolbar>
				</ModalBody>
			</Modal>
		</>
	);
};

export default UserDeleteModal;
