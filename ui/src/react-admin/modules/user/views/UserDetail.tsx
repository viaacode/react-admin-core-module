import type { IconName, MenuItemInfo } from '@viaa/avo2-components';
import {
	Button,
	ButtonToolbar,
	Checkbox,
	Container,
	MoreOptionsDropdown,
	Table,
	TagList,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { LomSchemeType, PermissionName } from '@viaa/avo2-types';
import { differenceInMilliseconds, formatDuration, intervalToDuration, parseISO } from 'date-fns';
import nlBE from 'date-fns/locale/nl-BE/index';
import { compact } from 'es-toolkit';
import type { FC, ReactText } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { AdminConfigManager, ToastType } from '~core/config/index';
import { useGetProfileById } from '~modules/user/hooks/use-get-profile-by-id';
import ConfirmModal from '~shared/components/ConfirmModal/ConfirmModal';
import { ErrorView } from '~shared/components/error/ErrorView';
import { Icon } from '~shared/components/Icon/Icon';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { CustomError } from '~shared/helpers/custom-error';
import { createDropdownMenuItem } from '~shared/helpers/dropdown';
import { renderAvatar } from '~shared/helpers/formatters/avatar';
import { formatDateString } from '~shared/helpers/formatters/date';
import { idpMapsToTagList } from '~shared/helpers/idps-to-taglist';
import { buildLink, navigate } from '~shared/helpers/link';

import {
	renderDateDetailRows,
	renderDetailRow,
	renderSimpleDetailRows,
} from '~shared/helpers/render-detail-fields';
import { showToast } from '~shared/helpers/show-toast';
import { stringsToTagList } from '~shared/helpers/strings-to-taglist';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AdminLayout } from '~shared/layouts/AdminLayout/AdminLayout';
import { PermissionService } from '~shared/services/permission-service';
import TempAccessModal from '../components/TempAccessModal';
import UserDeleteModal from '../components/UserDeleteModal';
import { UserService } from '../user.service';
import { Idp } from '../user.types';

export interface UserDetailProps {
	id: string | null;
	onSetTempAccess?: (profileId: string, tempAccess: Avo.User.TempAccess) => Promise<void>;
	onLoaded?: (user: Avo.User.CommonUser) => void;
	onGoBack: () => void;
	commonUser: Avo.User.CommonUser;
}

export const UserDetail: FC<UserDetailProps> = ({
	id,
	onSetTempAccess,
	onLoaded,
	commonUser,
	onGoBack,
}) => {
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

	const navigateFunc = AdminConfigManager.getConfig().services.router.navigateFunc;

	useEffect(() => {
		if (!!storedProfile && isFetched) {
			onLoaded?.(storedProfile);
		}
	}, [isFetched, onLoaded, storedProfile]);

	const hasPerm = useCallback(
		(permission: PermissionName) => PermissionService.hasPerm(commonUser, permission),
		[commonUser]
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

				showToast({
					type: ToastType.SUCCESS,
					description: isBlocked
						? tText('admin/users/views/user-detail___gebruiker-is-gedeblokkeerd')
						: tText('admin/users/views/user-detail___gebruiker-is-geblokkeerd'),
				});
			} else {
				showToast({
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

			showToast({
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
					navigateFunc,
					buildLink(AdminConfigManager.getAdminRoute('ADMIN_USER_EDIT'), {
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

	const handleSetTempAccess = async (newTempAccess: Avo.User.TempAccess) => {
		try {
			const profileId = storedProfile?.profileId;

			if (!profileId) {
				throw new CustomError('Invalid profileId');
			}

			// This callback will invoke a lot of functionality, see this method in avo2-client for more details.
			await onSetTempAccess?.(profileId, newTempAccess);
			setTempAccess(newTempAccess);

			await refetchProfileInfo();

			showToast({
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

			showToast({
				type: ToastType.ERROR,
				description: tText(
					'admin/users/views/user-detail___het-updaten-van-de-tijdelijke-toegang-is-mislukt'
				),
			});
		}
	};

	const renderTempAccess = (): string => {
		if (!tempAccess && !storedProfile?.tempAccess) {
			return '-';
		}
		const from = tempAccess?.from || storedProfile?.tempAccess?.from;
		const until = tempAccess?.until || storedProfile?.tempAccess?.until || '';
		return from
			? `${tText('admin/users/views/user-detail___van')} ${formatDateString(from)} ${tText(
					'admin/users/views/user-detail___tot'
				)} ${formatDateString(until)}`
			: `${tText('admin/users/views/user-detail___tot')} ${formatDateString(until)}`;
	};

	const renderTempAccessDuration = (): string => {
		if (!tempAccess && !storedProfile?.tempAccess) {
			return '-';
		}
		const from = tempAccess?.from || storedProfile?.tempAccess?.from;
		if (!from) {
			return '-';
		}
		const until = tempAccess?.until || storedProfile?.tempAccess?.until || '';
		const durationMs = differenceInMilliseconds(parseISO(until), parseISO(from));
		return formatDuration(intervalToDuration({ start: 0, end: durationMs }), { locale: nlBE });
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
					<Table horizontal variant="invisible" className="c-table_detail-page c-user_detail-page">
						<tbody>
							{renderDetailRow(
								renderAvatar(storedProfile, { small: false }),
								tText('admin/users/views/user-detail___avatar')
							)}
							{renderSimpleDetailRows<Avo.User.CommonUser>(storedProfile, [
								['firstName', tText('admin/users/views/user-detail___voornaam')],
								['lastName', tText('admin/users/views/user-detail___achternaam')],
								['alias', tText('admin/users/views/user-detail___gebruikersnaam')],
								['title', tText('admin/users/views/user-detail___functie')],
								['bio', tText('admin/users/views/user-detail___bio')],
								['stamboek', tText('admin/users/views/user-detail___stamboek-nummer')],
								['email', tText('admin/users/views/user-detail___primair-email-adres')],
								[
									'alternativeEmail',
									tText('admin/users/views/user-detail___secundair-email-adres'),
								],
							])}
							{renderDetailRow(
								userGroup ? userGroup.label : '-',
								tText('admin/users/views/user-detail___gebruikersgroep')
							)}
							{renderDateDetailRows<Avo.User.CommonUser>(storedProfile, [
								['createdAt', tText('admin/users/views/user-detail___aangemaakt-op')],
								['updatedAt', tText('admin/users/views/user-detail___aangepast-op')],
								['lastAccessAt', tText('admin/users/views/user-detail___laatste-toegang')],
							])}
							{renderSimpleDetailRows<Avo.User.CommonUser>(storedProfile, [
								['businessCategory', tText('admin/users/views/user-detail___oormerk')],
								['isException', tText('admin/users/views/user-detail___uitzonderingsaccount')],
								['isBlocked', tText('admin/users/views/user-detail___geblokkeerd')],
							])}
							{renderDateDetailRows<Avo.User.CommonUser>(storedProfile, [
								['blockedAt', tText('admin/users/views/user-detail___laatst-geblokeerd-op')],
								['unblockedAt', tText('admin/users/views/user-detail___laatst-gedeblokkeerd-op')],
							])}
							{renderDetailRow(
								renderTempAccess(),
								tText('admin/users/views/user-detail___tijdelijk-account'),
								hasPerm(PermissionName.EDIT_USER_TEMP_ACCESS)
							)}
							{renderDetailRow(
								renderTempAccessDuration(),
								tText('admin/users/views/user-detail___totale-toegang'),
								hasPerm(PermissionName.EDIT_USER_TEMP_ACCESS)
							)}
							{renderDetailRow(
								idpMapsToTagList(Object.keys(storedProfile.idps || {}) as Idp[], 'idps') || '-',
								tText('admin/users/views/user-detail___gelinked-aan')
							)}
							{renderDetailRow(
								stringsToTagList(
									compact(
										(storedProfile?.loms || [])
											.filter((lom) => lom.lom?.scheme === LomSchemeType.structure)
											.map((lom) => lom.lom?.label)
									)
								) || '-',
								tText('react-admin/modules/user/views/user-detail___onderwijs')
							)}
							{renderDetailRow(
								stringsToTagList(
									compact(
										(storedProfile?.loms || [])
											.filter((lom) => lom.lom?.scheme === LomSchemeType.theme)
											.map((lom) => lom.lom?.label)
									)
								) || '-',
								tText('react-admin/modules/user/views/user-detail___themas')
							)}
							{renderDetailRow(
								stringsToTagList(
									compact(
										(storedProfile?.loms || [])
											.filter((lom) => lom.lom?.scheme === LomSchemeType.subject)
											.map((lom) => lom.lom?.label)
									)
								) || '-',
								tText('admin/users/views/user-detail___vakken')
							)}
							{renderDetailRow(
								storedProfile.educationalOrganisations?.length ? (
									<TagList
										closable={false}
										swatches={false}
										tags={storedProfile.educationalOrganisations.map(
											(item: Avo.EducationOrganization.Organization) => ({
												label: item.organisationLabel,
												id: item.organisationId,
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
		navigate(navigateFunc, AdminConfigManager.getAdminRoute('ADMIN_USER_OVERVIEW'));

	const renderUserDetailPage = () => {
		const isBlocked = storedProfile?.isBlocked;
		const blockButtonTooltip = isBlocked
			? tText('admin/users/views/user-detail___laat-deze-gebruiker-terug-toe-op-het-av-o-platform')
			: tText('admin/users/views/user-detail___ban-deze-gebruiker-van-het-av-o-platform');
		return (
			<>
				<AdminLayout pageTitle={tText('admin/users/views/user-detail___gebruiker-details')}>
					<AdminLayout.Back>
						<Button type="borderless" onClick={onGoBack}>
							<Icon name="chevronLeft"></Icon>
						</Button>
					</AdminLayout.Back>
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
							<a href={getLdapDashboardUrl() || ''} target="_blank" rel="noopener noreferrer">
								<Button
									label={tText('admin/users/views/user-detail___beheer-in-account-manager')}
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
				icon={'alertTriangle' as IconName}
			/>
		);
	}
	return renderUserDetailPage();
};
