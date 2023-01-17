import {
	Button,
	ButtonToolbar,
	Checkbox,
	Container,
	MenuItemInfo,
	MoreOptionsDropdown,
	Table,
	TagList,
	TagOption,
} from '@viaa/avo2-components';
import { PermissionName } from '@viaa/avo2-types';
import type { Avo } from '@viaa/avo2-types';
import moment from 'moment';
import React, { FC, ReactText, useCallback, useEffect, useState } from 'react';
import { ErrorView } from '~modules/shared/components/error';
import { CenteredSpinner } from '~modules/shared/components/Spinner/CenteredSpinner';
import { useGetProfileById } from '~modules/user/use-get-profile-by-id';

import {
	renderDateDetailRows,
	renderDetailRow,
	renderSimpleDetailRows,
} from '../../shared/helpers/render-detail-fields';
import { AdminLayout } from '../../shared/layouts';
import UserDeleteModal from '../components/UserDeleteModal';
import { UserService } from '../user.service';
import { AdminConfigManager, ToastType } from '~core/config';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { PermissionService } from '~modules/shared/services/permission-service';
import { CommonUser, Idp } from '../user.types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { createDropdownMenuItem } from '~modules/shared/helpers/dropdown';
import { buildLink, navigate } from '~modules/shared/helpers/link';
import ConfirmModal from '~modules/shared/components/ConfirmModal/ConfirmModal';
import TempAccessModal from '../components/TempAccessModal';
import { idpMapsToTagList } from '~modules/shared/helpers/idps-to-taglist';
import { formatDate, normalizeTimestamp } from '~modules/shared/helpers/formatters/date';
import { renderAvatar } from '../../shared/helpers/formatters/avatar';
import { stringsToTagList } from '~modules/shared/helpers/strings-to-taglist';

export interface UserDetailProps {
	id: string | null;
	onSetTempAccess?: (
		userId: string,
		tempAccess: Avo.User.TempAccess,
		profileId: string
	) => Promise<void>;
	onLoaded?: (user: CommonUser) => void;
}

export const UserDetail: FC<UserDetailProps> = ({ id, onSetTempAccess, onLoaded }) => {
	// Hooks
	const {
		data: storedProfile,
		isLoading,
		isError,
		refetch: refetchProfileInfo,
		isFetched,
	} = useGetProfileById(id);
	const [tempAccess, setTempAccess] = useState<Avo.User.TempAccess | null>(null);
	const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState<boolean>(false);
	const [isTempAccessModalOpen, setIsTempAccessModalOpen] = useState<boolean>(false);
	const [userDeleteModalOpen, setUserDeleteModalOpen] = useState<boolean>(false);
	const [isConfirmBlockUserModalVisible, setIsConfirmBlockUserModalVisible] =
		useState<boolean>(false);
	const [isConfirmUnblockUserModalVisible, setIsConfirmUnblockUserModalVisible] =
		useState<boolean>(false);
	const [shouldSendActionEmail, setShouldSendActionEmail] = useState<boolean>(false);

	const { tText, tHtml } = useTranslation();
	const history = AdminConfigManager.getConfig().services.router.useHistory();
	const user = AdminConfigManager.getConfig().user;

	useEffect(() => {
		if (!!storedProfile && isFetched) {
			onLoaded?.(storedProfile);
		}
	}, [isFetched, onLoaded, storedProfile]);

	const hasPerm = useCallback(
		(permission: PermissionName) => PermissionService.hasPerm(user, permission),
		[user]
	);

	const getLdapDashboardUrl = () => {
		const userIdpId = storedProfile?.idps?.[Idp.HETARCHIEF];

		if (userIdpId) {
			return `${AdminConfigManager.getConfig().env.LDAP_DASHBOARD_PEOPLE_URL}/${userIdpId}`;
		}

		return null;
	};

	const canBanUser = (): boolean => {
		return hasPerm(PermissionName.EDIT_BAN_USER_STATUS);
	};

	const toggleBlockedStatus = async () => {
		try {
			const profileId = storedProfile?.profileId;
			const isBlocked = storedProfile?.isBlocked || false;

			if (profileId) {
				await UserService.updateBlockStatusByProfileIds(
					[profileId],
					!isBlocked,
					shouldSendActionEmail
				);
				await refetchProfileInfo();

				AdminConfigManager.getConfig().services.toastService.showToast({
					type: ToastType.SUCCESS,
					description: isBlocked
						? tText('admin/users/views/user-detail___gebruiker-is-gedeblokkeerd')
						: tText('admin/users/views/user-detail___gebruiker-is-geblokkeerd'),
				});
			} else {
				AdminConfigManager.getConfig().services.toastService.showToast({
					type: ToastType.ERROR,
					description: tText(
						'admin/users/views/user-detail___het-updaten-van-de-gebruiker-is-mislukt-omdat-zijn-id-niet-kon-worden-gevonden'
					),
				});
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to update is_blocked field for user', err, {
					profile: storedProfile,
				})
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				type: ToastType.ERROR,
				description: tText(
					'admin/users/views/user-detail___het-updaten-van-de-gebruiker-is-mislukt'
				),
			});
		}
	};

	const CONTENT_DROPDOWN_ITEMS: MenuItemInfo[] = [
		...(hasPerm(PermissionName.EDIT_USER_TEMP_ACCESS)
			? [
					createDropdownMenuItem(
						'tempAccess',
						tText('admin/users/views/user-detail___tijdelijke-toegang'),
						'clock'
					),
			  ]
			: []),
		createDropdownMenuItem('edit', tText('admin/users/views/user-detail___bewerken')),
		createDropdownMenuItem('delete', tText('admin/users/views/user-detail___verwijderen')),
	];

	const executeAction = async (item: ReactText) => {
		setIsOptionsMenuOpen(false);
		switch (item) {
			case 'tempAccess':
				setIsTempAccessModalOpen(true);
				break;

			case 'edit':
				navigate(
					history,
					buildLink(AdminConfigManager.getConfig().routes.USER_EDIT, {
						id: id as string,
					})
				);
				break;

			case 'delete':
				setUserDeleteModalOpen(true);
				break;

			default:
				return null;
		}
	};

	const handleSetTempAccess = async (tempAccess: Avo.User.TempAccess) => {
		try {
			const userId = storedProfile?.userId;

			if (!userId) {
				throw new CustomError('Invalid userId');
			}

			const profileId = storedProfile?.profileId;

			if (!profileId) {
				throw new CustomError('Invalid profileId');
			}

			// This callback will invoke a lot of functionality, see this method in avo2-client for more details.
			await onSetTempAccess?.(userId, tempAccess, profileId);
			setTempAccess(tempAccess);

			await refetchProfileInfo();

			AdminConfigManager.getConfig().services.toastService.showToast({
				type: ToastType.SUCCESS,
				description: tText(
					'admin/users/views/user-detail___tijdelijke-toegang-werd-successvol-geupdated'
				),
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to update temp access for user', err, {
					profile: storedProfile,
				})
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				type: ToastType.ERROR,
				description: tText(
					'admin/users/views/user-detail___het-updaten-van-de-tijdelijke-toegang-is-mislukt'
				),
			});
		}
	};

	const renderTempAccess = (tempAccess: Avo.User.TempAccess | null): string => {
		if (!tempAccess) {
			return '-';
		}
		const from = tempAccess?.from;
		const until = tempAccess?.until;
		return from
			? `${tText('admin/users/views/user-detail___van')} ${formatDate(from)} ${tText(
					'admin/users/views/user-detail___tot'
			  )} ${formatDate(until)}`
			: `${tText('admin/users/views/user-detail___tot')} ${formatDate(until)}`;
	};

	const renderTempAccessDuration = (tempAccess: Avo.User.TempAccess | null): string => {
		if (!tempAccess) {
			return '-';
		}
		const from = tempAccess?.from;
		if (!from) {
			return '-';
		}
		const until = tempAccess?.until || '';
		return moment.duration(normalizeTimestamp(until).diff(normalizeTimestamp(from))).humanize();
	};

	const renderUserDetail = () => {
		if (!storedProfile || !storedProfile) {
			console.error(
				new CustomError(
					'Failed to load user because render function is called before user was fetched'
				)
			);
			return;
		}

		const userGroup = storedProfile.userGroup;

		return (
			<Container mode="vertical" size="small">
				<Container mode="horizontal">
					<Table horizontal variant="invisible" className="c-table_detail-page">
						<tbody>
							{renderDetailRow(
								renderAvatar(storedProfile, { small: false }),
								tText('admin/users/views/user-detail___avatar')
							)}
							{renderSimpleDetailRows(storedProfile, [
								['firstName', tText('admin/users/views/user-detail___voornaam')],
								['lastName', tText('admin/users/views/user-detail___achternaam')],
								['alias', tText('admin/users/views/user-detail___gebruikersnaam')],
								['title', tText('admin/users/views/user-detail___functie')],
								['bio', tText('admin/users/views/user-detail___bio')],
								[
									'stamboek',
									tText('admin/users/views/user-detail___stamboek-nummer'),
								],
								[
									'email',
									tText('admin/users/views/user-detail___primair-email-adres'),
								],
								[
									'alternativeEmail',
									tText('admin/users/views/user-detail___secundair-email-adres'),
								],
							])}
							{renderDetailRow(
								userGroup ? userGroup.label : '-',
								tText('admin/users/views/user-detail___gebruikersgroep')
							)}
							{renderDateDetailRows(storedProfile, [
								[
									'createdAt',
									tText('admin/users/views/user-detail___aangemaakt-op'),
								],
								[
									'updatedAt',
									tText('admin/users/views/user-detail___aangepast-op'),
								],
								[
									'lastAccessAt',
									tText('admin/users/views/user-detail___laatste-toegang'),
								],
							])}
							{renderSimpleDetailRows(storedProfile, [
								[
									'businessCategory',
									tText('admin/users/views/user-detail___oormerk'),
								],
								[
									'isException',
									tText('admin/users/views/user-detail___uitzonderingsaccount'),
								],
								['isBlocked', tText('admin/users/views/user-detail___geblokkeerd')],
							])}
							{renderDateDetailRows(storedProfile, [
								[
									'blockedAt',
									tText('admin/users/views/user-detail___laatst-geblokeerd-op'),
								],
								[
									'unblockedAt',
									tText(
										'admin/users/views/user-detail___laatst-gedeblokkeerd-op'
									),
								],
							])}
							{hasPerm(PermissionName.EDIT_USER_TEMP_ACCESS) &&
								renderDetailRow(
									renderTempAccess(tempAccess),
									tText('admin/users/views/user-detail___tijdelijk-account')
								)}
							{hasPerm(PermissionName.EDIT_USER_TEMP_ACCESS) &&
								renderDetailRow(
									renderTempAccessDuration(tempAccess),
									tText('admin/users/views/user-detail___totale-toegang')
								)}
							{renderDetailRow(
								idpMapsToTagList(
									Object.keys(storedProfile.idps || {}) as Idp[],
									'idps'
								) || '-',
								tText('admin/users/views/user-detail___gelinked-aan')
							)}
							{renderDetailRow(
								stringsToTagList(storedProfile?.subjects || []) || '-',
								tText('admin/users/views/user-detail___vakken')
							)}
							{renderDetailRow(
								storedProfile.educationLevels?.length ? (
									<TagList
										tags={storedProfile.educationLevels.map(
											(item: string): TagOption => ({
												id: item,
												label: item,
											})
										)}
										swatches={false}
										closable={false}
									/>
								) : (
									'-'
								),
								tText('admin/users/views/user-detail___opleidingsniveaus')
							)}
							{renderDetailRow(
								storedProfile.educationalOrganisations?.length ? (
									<TagList
										closable={false}
										swatches={false}
										tags={storedProfile.educationalOrganisations.map(
											(item) => ({
												label: item.label,
												id: item.organizationId,
											})
										)}
									/>
								) : (
									'-'
								),
								tText('admin/users/views/user-detail___educatieve-organisaties')
							)}
							{renderDetailRow(
								storedProfile.organisation?.name || '-',
								tText('admin/users/views/user-detail___bedrijf')
							)}
						</tbody>
					</Table>
				</Container>
			</Container>
		);
	};

	// Executed when the user was deleted
	const deleteCallback = () =>
		navigate(history, AdminConfigManager.getConfig().routes.USER_OVERVIEW);

	const renderUserDetailPage = () => {
		const isBlocked = storedProfile?.isBlocked;
		const blockButtonTooltip = isBlocked
			? tText(
					'admin/users/views/user-detail___laat-deze-gebruiker-terug-toe-op-het-av-o-platform'
			  )
			: tText('admin/users/views/user-detail___ban-deze-gebruiker-van-het-av-o-platform');
		return (
			<>
				<AdminLayout pageTitle={tText('admin/users/views/user-detail___gebruiker-details')}>
					<AdminLayout.Actions>
						<ButtonToolbar>
							{canBanUser() && (
								<Button
									type={isBlocked ? 'primary' : 'danger'}
									label={
										isBlocked
											? tText('admin/users/views/user-detail___deblokkeren')
											: tText('admin/users/views/user-detail___blokkeren')
									}
									title={blockButtonTooltip}
									ariaLabel={blockButtonTooltip}
									onClick={() => {
										if (isBlocked) {
											setIsConfirmUnblockUserModalVisible(true);
										} else {
											setIsConfirmBlockUserModalVisible(true);
										}
									}}
								/>
							)}
							<a
								href={getLdapDashboardUrl() || ''}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button
									label={tText(
										'admin/users/views/user-detail___beheer-in-account-manager'
									)}
									ariaLabel={tText(
										'admin/users/views/user-detail___open-deze-gebruiker-in-het-account-beheer-dashboard-van-meemoo'
									)}
									disabled={!getLdapDashboardUrl()}
									title={
										getLdapDashboardUrl()
											? tText(
													'admin/users/views/user-detail___open-deze-gebruiker-in-het-account-beheer-dashboard-van-meemoo'
											  )
											: tText(
													'admin/users/views/user-detail___deze-gebruiker-is-niet-gelinked-aan-een-archief-account'
											  )
									}
								/>
							</a>
							<MoreOptionsDropdown
								isOpen={isOptionsMenuOpen}
								onOpen={() => setIsOptionsMenuOpen(true)}
								onClose={() => setIsOptionsMenuOpen(false)}
								menuItems={CONTENT_DROPDOWN_ITEMS}
								onOptionClicked={executeAction}
							/>
						</ButtonToolbar>
					</AdminLayout.Actions>

					<AdminLayout.Content>{renderUserDetail()}</AdminLayout.Content>
				</AdminLayout>

				<TempAccessModal
					tempAccess={tempAccess}
					isOpen={isTempAccessModalOpen}
					onClose={() => setIsTempAccessModalOpen(false)}
					setTempAccessCallback={handleSetTempAccess}
				/>

				<ConfirmModal
					isOpen={isConfirmBlockUserModalVisible}
					onClose={() => {
						setIsConfirmBlockUserModalVisible(false);
						setShouldSendActionEmail(false);
					}}
					deleteObjectCallback={async () => {
						setIsConfirmBlockUserModalVisible(false);
						setShouldSendActionEmail(false);
						await toggleBlockedStatus();
					}}
					title={tText('admin/users/views/user-detail___bevestig')}
					confirmLabel={tText('admin/users/views/user-detail___deactiveren')}
					body={
						<>
							<strong>
								{tText(
									'admin/users/views/user-detail___weet-je-zeker-dat-je-deze-gebruiker-wil-deactiveren'
								)}
							</strong>
							<Checkbox
								label={tText(
									'admin/users/views/user-detail___breng-de-gebruiker-op-de-hoogte-van-deze-actie'
								)}
								checked={shouldSendActionEmail}
								onChange={(newShouldSendActionEmail) =>
									setShouldSendActionEmail(newShouldSendActionEmail)
								}
							/>
						</>
					}
				/>

				<ConfirmModal
					isOpen={isConfirmUnblockUserModalVisible}
					onClose={() => {
						setIsConfirmUnblockUserModalVisible(false);
						setShouldSendActionEmail(false);
					}}
					deleteObjectCallback={async () => {
						setIsConfirmUnblockUserModalVisible(false);
						setShouldSendActionEmail(false);
						await toggleBlockedStatus();
					}}
					title={tText('admin/users/views/user-detail___bevestig')}
					confirmLabel={tText('admin/users/views/user-detail___opnieuw-activeren')}
					confirmButtonType={'primary'}
					body={
						<>
							<strong>
								{tHtml(
									'admin/users/views/user-detail___weet-je-zeker-dat-je-deze-gebruiker-opnieuw-wil-activeren'
								)}
							</strong>
							<Checkbox
								label={tText(
									'admin/users/views/user-detail___breng-de-gebruiker-op-de-hoogte-van-deze-actie'
								)}
								checked={shouldSendActionEmail}
								onChange={(newShouldSendActionEmail) =>
									setShouldSendActionEmail(newShouldSendActionEmail)
								}
							/>
						</>
					}
				/>

				{storedProfile && (
					<UserDeleteModal
						selectedProfileIds={[storedProfile.profileId]}
						isOpen={userDeleteModalOpen}
						onClose={() => setUserDeleteModalOpen(false)}
						deleteCallback={deleteCallback}
					/>
				)}
			</>
		);
	};

	if (isLoading) {
		return <CenteredSpinner />;
	}
	if (isError) {
		return (
			<ErrorView
				message={tText(
					'admin/users/views/user-detail___het-ophalen-van-de-gebruiker-info-is-mislukt'
				)}
				icon="alert-triangle"
			/>
		);
	}
	return renderUserDetailPage();
};
