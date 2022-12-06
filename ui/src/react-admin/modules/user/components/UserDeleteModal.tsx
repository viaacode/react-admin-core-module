import { get } from 'lodash-es';
import React, { FunctionComponent, ReactNode, useState } from 'react';

import {
	Alert,
	Button,
	ButtonToolbar,
	Modal,
	ModalBody,
	ModalFooterRight,
	RadioButtonGroup,
	Spacer,
	Toolbar,
	ToolbarItem,
	ToolbarRight,
} from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';

import { ContentPicker } from '../../shared/components/ContentPicker/ContentPicker';
import { UserService } from '~modules/user';
import { DeleteContentCounts } from '../user.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { buildLink } from '~modules/shared/helpers/link';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { ADMIN_PATH } from '~modules/shared/consts/admin.const';
import { PickerItem } from '~modules/shared/types/content-picker';
import { GET_DELETE_RADIO_OPTIONS } from '~modules/shared/consts/user.const';
import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';

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
	const { tHtml, tText } = useTranslation();

	const [transferToUser, setTransferToUser] = useState<PickerItem | null>(null);
	const [transferToUserError, setTransferToUserError] = useState<string | undefined>();
	const [selectedDeleteOption, setSelectedDeleteOption] =
		useState<Avo.User.UserDeleteOption>('DELETE_ALL');
	const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<boolean>(false);
	const [deleteContentCounts, setDeleteContentCounts] = useState<DeleteContentCounts | null>(
		null
	);

	const validateOptionModalAndOpenConfirm = async () => {
		try {
			if (
				(selectedDeleteOption === 'TRANSFER_PUBLIC' ||
					selectedDeleteOption === 'TRANSFER_ALL') &&
				!transferToUser
			) {
				// transfer user was not selected, or transfer user is the same user as one of the user that will be deleted
				setTransferToUserError(
					tText(
						'admin/users/views/user-overview___kies-een-gebruiker-om-de-content-naar-over-te-dragen'
					)
				);
				return;
			}
			if (
				(selectedDeleteOption === 'TRANSFER_PUBLIC' ||
					selectedDeleteOption === 'TRANSFER_ALL') &&
				transferToUser &&
				selectedProfileIds.includes(transferToUser.value)
			) {
				// transfer user was not selected, or transfer user is the same user as one of the user that will be deleted
				setTransferToUserError(
					tText(
						'admin/users/views/user-overview___je-kan-geen-content-overdragen-naar-een-gebruiker-die-verwijdert-zal-worden'
					)
				);
				return;
			}

			// Fetch counts to inform the user of what objects they are about to delete
			setDeleteContentCounts(
				await UserService.fetchPublicAndPrivateCounts(selectedProfileIds)
			);
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
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'modules/user/components/user-delete-modal___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/users/views/user-overview___het-ophalen-van-de-content-items-voor-de-geselecteerde-gebruikers-is-mislukt'
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
		const Link = AdminConfigManager.getConfig().services.router.Link;

		const publicCollections: number = get(deleteContentCounts, 'publicCollections') || 0;
		const privateCollections: number = get(deleteContentCounts, 'privateCollections') || 0;
		const assignments: number = get(deleteContentCounts, 'assignments') || 0;
		const bookmarks: number = get(deleteContentCounts, 'bookmarks') || 0;
		const publicContentPages: number = get(deleteContentCounts, 'publicContentPages') || 0;
		const privateContentPages: number = get(deleteContentCounts, 'privateContentPages') || 0;

		const isDeleteAll = selectedDeleteOption === 'DELETE_ALL';
		const isTransferAll = selectedDeleteOption === 'TRANSFER_ALL';

		const countOutputs: ReactNode[] = [];
		if (isDeleteAll && publicCollections) {
			countOutputs.push(
				<Link
					to={buildLink(
						ADMIN_PATH.COLLECTIONS_OVERVIEW,
						{},
						{
							is_public: '1',
							owner_profile_id: selectedProfileIds.join('~'),
						}
					)}
				>
					{`${publicCollections} ${tHtml(
						'admin/users/views/user-overview___publieke-collecties'
					)}`}
				</Link>
			);
		}
		if (!isTransferAll && privateCollections) {
			countOutputs.push(
				<Link
					to={buildLink(
						ADMIN_PATH.COLLECTIONS_OVERVIEW,
						{},
						{
							is_public: '0',
							owner_profile_id: selectedProfileIds.join('~'),
						}
					)}
				>
					{`${privateCollections} ${tHtml(
						'admin/users/views/user-overview___prive-collecties'
					)}`}
				</Link>
			);
		}
		if (isDeleteAll && publicContentPages) {
			countOutputs.push(
				<Link
					to={buildLink(
						ADMIN_PATH.OVERVIEW,
						{},
						{
							is_public: '1',
							user_profile_id: selectedProfileIds.join('~'),
						}
					)}
				>
					{`${publicContentPages} ${tHtml(
						'admin/users/views/user-overview___publieke-content-paginas'
					)}`}
				</Link>
			);
		}
		if (!isTransferAll && privateContentPages) {
			countOutputs.push(
				<Link
					to={buildLink(
						ADMIN_PATH.OVERVIEW,
						{},
						{
							is_public: '0',
							user_profile_id: selectedProfileIds.join('~'),
						}
					)}
				>
					{`${privateContentPages} ${tHtml(
						'admin/users/views/user-overview___prive-content-paginas'
					)}`}
				</Link>
			);
		}
		if (!isTransferAll && assignments) {
			countOutputs.push(
				`${assignments} ${tHtml('admin/users/views/user-overview___opdrachten')}`
			);
		}
		if (!isTransferAll && bookmarks) {
			countOutputs.push(
				`${bookmarks} ${tHtml('admin/users/views/user-overview___bladwijzers')}`
			);
		}
		return (
			<>
				{tHtml(
					'admin/users/views/user-overview___weet-je-zeker-dat-je-deze-gebruikers-wil-verwijderen'
				)}

				{!!countOutputs.length && (
					<Spacer margin="top" className="c-content">
						<strong>Deze inhoud zal verwijderd worden:</strong>
						<ul>
							{countOutputs.map((count, index) => (
								<li key={`content-count-${index}`}>{count}</li>
							))}
						</ul>
					</Spacer>
				)}

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
			await UserService.bulkDeleteUsers(
				selectedProfileIds,
				selectedDeleteOption,
				false, // TODO sync sendEmail feature
				transferToUser?.value
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'modules/user/components/user-delete-modal___success'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/users/views/user-edit___de-gebruiker-is-aangepast'
				),
				type: ToastType.SUCCESS,
			});
			deleteCallback();
		} catch (err) {
			console.error(new CustomError('Failed to remove users', err));
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'modules/user/components/user-delete-modal___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/users/views/user-overview___het-verwijderen-van-de-geselecteerde-gebruikers-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	return (
		<>
			<Modal
				title={tText('admin/users/views/user-overview___verwijder-opties')}
				isOpen={isOpen}
				onClose={onClose}
				size="medium"
			>
				<ModalBody>
					<RadioButtonGroup
						options={GET_DELETE_RADIO_OPTIONS()}
						value={selectedDeleteOption}
						onChange={setSelectedDeleteOption as any}
					/>
					{(selectedDeleteOption === 'TRANSFER_PUBLIC' ||
						selectedDeleteOption === 'TRANSFER_ALL') && (
						<ContentPicker
							allowedTypes={[ContentPickerType.PROFILE]}
							onSelect={setTransferToUser}
							initialValue={transferToUser}
							placeholder={tText(
								'admin/users/views/user-overview___overdragen-naar-gebruiker'
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
										label={tText(
											'admin/users/views/user-overview___verwijder-gebruikers'
										)}
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
										label={tText(
											'admin/users/views/user-overview___verwijder-gebruikers'
										)}
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
