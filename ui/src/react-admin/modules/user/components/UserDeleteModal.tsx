import React, { FunctionComponent, ReactNode, useState } from 'react';

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

import { ContentPicker } from '~shared/components/ContentPicker/ContentPicker';
import { DeleteContentCounts } from '../user.types';
import { useTranslation } from '~shared/hooks/useTranslation';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { buildLink } from '~shared/helpers/link';
import { CustomError } from '~shared/helpers/custom-error';
import { PickerItem } from '~shared/types/content-picker';
import { GET_DELETE_RADIO_OPTIONS } from '~shared/consts/user.const';
import { UserService } from '../user.service';

import './UserDeleteModal.scss';
import { Link } from '~modules/shared/components/Link';

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
	const [shouldSendEmail, setShouldSendEmail] = useState<boolean>(false);

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
								'react-admin/modules/user/components/user-delete-modal___publieke-collectie'
						  )
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___publieke-collecties'
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
								'react-admin/modules/user/components/user-delete-modal___prive-collectie'
						  )
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___prive-collecties'
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
								'react-admin/modules/user/components/user-delete-modal___publieke-bundel'
						  )
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___publieke-bundels'
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
								'react-admin/modules/user/components/user-delete-modal___prive-bundel'
						  )
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___prive-bundels'
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
								'react-admin/modules/user/components/user-delete-modal___publieke-opdracht'
						  )
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___publieke-opdrachten'
						  )}
				</Link>
			);
		}
		if (
			isDeleteAll &&
			deleteContentCounts.publicAssignments &&
			deleteContentCounts.publicAssignmentPupilCollections
		) {
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute(
							'ADMIN_ASSIGNMENT_PUPIL_COLLECTIONS_OVERVIEW'
						),
						{},
						{
							teacher: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.publicAssignmentPupilCollections === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___met-1-leerlingen-collectie'
						  )
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___met-number-of-collections-leerlingen-collecties',
								{
									numberOfCollections: String(
										deleteContentCounts.publicAssignmentPupilCollections
									),
								}
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
								'react-admin/modules/user/components/user-delete-modal___prive-opdracht'
						  )
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___prive-opdrachten'
						  )}
				</Link>
			);
		}
		if (
			isDeleteAll &&
			deleteContentCounts.privateAssignments &&
			deleteContentCounts.privateAssignmentPupilCollections
		) {
			countOutputs.push(
				<Link
					to={buildLink(
						AdminConfigManager.getAdminRoute(
							'ADMIN_ASSIGNMENT_PUPIL_COLLECTIONS_OVERVIEW'
						),
						{},
						{
							teacher: selectedProfileIds.join('~'),
						}
					)}
				>
					{deleteContentCounts.privateAssignmentPupilCollections === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___met-1-leerlingen-collectie'
						  )
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___met-number-of-collections-leerlingen-collecties',
								{
									numberOfCollections: String(
										deleteContentCounts.privateAssignmentPupilCollections
									),
								}
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
								'react-admin/modules/user/components/user-delete-modal___sneldeel-link'
						  )
						: tHtml(
								'react-admin/modules/user/components/user-delete-modal___sneldeel-links'
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
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___prive-content-pagina'
						  )
						: tHtml('admin/users/views/user-overview___prive-content-paginas')}
				</Link>
			);
		}
		if (!isTransferAll && deleteContentCounts.bookmarks) {
			countOutputs.push(
				<>
					{deleteContentCounts.bookmarks}{' '}
					{deleteContentCounts.bookmarks === 1
						? tHtml(
								'react-admin/modules/user/components/user-delete-modal___bladwijzer'
						  )
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
								'react-admin/modules/user/components/user-delete-modal___deze-inhoud-zal-verwijderd-worden'
							)}
						</strong>
						<ul>
							{countOutputs.map((count, index) => (
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
				className="c-user-delete-modal"
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
							allowedTypes={['PROFILE']}
							value={transferToUser}
							onChange={setTransferToUser}
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
