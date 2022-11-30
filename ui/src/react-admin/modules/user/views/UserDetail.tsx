import { Checkbox, Container, Table, TagList, TagOption } from '@viaa/avo2-components';
import { get } from 'lodash-es';
import moment from 'moment';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingErrorLoadedComponent, LoadingInfo } from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { PermissionService } from '~modules/shared/services/permission-service';

import {
	renderDateDetailRows,
	renderDetailRow,
	renderSimpleDetailRows,
} from '../../shared/helpers/render-detail-fields';
import UserDeleteModal from '../components/UserDeleteModal';
import { UserService } from '../user.service';
import { CommonUser, Permission, RawUserGroup, UserTempAccess } from '../user.types';
import { AdminConfigManager, ToastType } from '~core/config';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { formatDate, normalizeTimestamp } from '~modules/shared/helpers/formatters/date';
import { USER_PATH } from '../user.consts';
import { navigate } from '~modules/shared/helpers/link';
import ConfirmModal from '~modules/shared/components/ConfirmModal/ConfirmModal';

export interface UserDetailProps {
	id: string;
}

const UserDetail: FunctionComponent<UserDetailProps> = ({ id }) => {
	const [t] = useTranslation();
	const history = AdminConfigManager.getConfig().services.router.useHistory();
	const user = AdminConfigManager.getConfig().user;

	// Hooks
	const [item, setItem] = useState<CommonUser | null>(null);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [tempAccess, setTempAccess] = useState<UserTempAccess | null>(null);
	const [isTempAccessModalOpen, setIsTempAccessModalOpen] = useState<boolean>(false);
	const [userDeleteModalOpen, setUserDeleteModalOpen] = useState<boolean>(false);
	const [isConfirmBlockUserModalVisible, setIsConfirmBlockUserModalVisible] =
		useState<boolean>(false);
	const [isConfirmUnblockUserModalVisible, setIsConfirmUnblockUserModalVisible] =
		useState<boolean>(false);
	const [shouldSendActionEmail, setShouldSendActionEmail] = useState<boolean>(false);

	const hasPerm = useCallback(
		(permission: Permission) => PermissionService.hasPerm(user, permission),
		[user]
	);

	const fetchProfileById = useCallback(async () => {
		try {
			setItem(await UserService.getProfileById(id));
		} catch (err) {
			console.error(
				new CustomError('Failed to get user by id', err, {
					query: 'GET_USER_BY_ID',
					variables: {
						id,
					},
				})
			);

			setLoadingInfo({
				state: 'error',
				message: t(
					'admin/users/views/user-detail___het-ophalen-van-de-gebruiker-info-is-mislukt'
				),
			});
		}
	}, [setItem, setLoadingInfo, t, id]);

	useEffect(() => {
		fetchProfileById();
	}, [fetchProfileById]);

	useEffect(() => {
		if (item) {
			setLoadingInfo({
				state: 'loaded',
			});
		}
	}, [item, setLoadingInfo]);

	const toggleBlockedStatus = async () => {
		try {
			const profileId = get(item, 'profile_id');
			const isBlocked = get(item, 'is_blocked') || false;

			if (profileId) {
				await UserService.updateBlockStatusByProfileIds(
					[profileId],
					!isBlocked,
					shouldSendActionEmail
				);
				await fetchProfileById();

				AdminConfigManager.getConfig().services.toastService.showToast({
					description: isBlocked
						? t('admin/users/views/user-detail___gebruiker-is-gedeblokkeerd')
						: t('admin/users/views/user-detail___gebruiker-is-geblokkeerd'),
					type: ToastType.SUCCESS,
				});
			} else {
				AdminConfigManager.getConfig().services.toastService.showToast({
					description: t(
						'admin/users/views/user-detail___het-updaten-van-de-gebruiker-is-mislukt-omdat-zijn-id-niet-kon-worden-gevonden'
					),
					type: ToastType.ERROR,
				});
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to update is_blocked field for user', err, {
					profile: item,
				})
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				description: t(
					'admin/users/views/user-detail___het-updaten-van-de-gebruiker-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const onSetTempAccess = async (tempAccess: UserTempAccess) => {
		try {
			const userId = get(item, 'user_id');

			if (!userId) {
				throw new CustomError('Invalid userId');
			}

			const profileId = get(item, 'profile_id');

			if (!profileId) {
				throw new CustomError('Invalid profileId');
			}

			await UserService.updateTempAccessByUserId(userId, tempAccess, profileId);

			setTempAccess(tempAccess);

			await fetchProfileById();

			AdminConfigManager.getConfig().services.toastService.showToast({
				description: t(
					'admin/users/views/user-detail___tijdelijke-toegang-werd-successvol-geupdated'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to update temp access for user', err, {
					profile: item,
				})
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				description: t(
					'admin/users/views/user-detail___het-updaten-van-de-tijdelijke-toegang-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const renderTempAccess = (tempAccess: UserTempAccess | null): string => {
		if (!tempAccess) {
			return '-';
		}
		const from = get(tempAccess, 'from');
		const until = get(tempAccess, 'until');
		return from
			? `${t('admin/users/views/user-detail___van')} ${formatDate(from)} ${t(
					'admin/users/views/user-detail___tot'
			  )} ${formatDate(until)}`
			: `${t('admin/users/views/user-detail___tot')} ${formatDate(until)}`;
	};

	const renderTempAccessDuration = (tempAccess: UserTempAccess | null): string => {
		if (!tempAccess) {
			return '-';
		}
		const from = get(tempAccess, 'from');
		if (!from) {
			return '-';
		}
		const until = get(tempAccess, 'until') || '';
		const months = moment
			.duration(normalizeTimestamp(until).diff(normalizeTimestamp(from)))
			.humanize();
		return months;
	};

	const renderUserDetail = () => {
		if (!item) {
			console.error(
				new CustomError(
					'Failed to load user because render function is called before user was fetched'
				)
			);
			return;
		}

		const userGroup: RawUserGroup = get(item, 'profile.profile_user_group.group');

		const eduOrgs: {
			unit_id: string;
			organization_id: string;
			organization: {
				ldap_description: string;
			};
		}[] = get(item, 'organisations') || [];

		return (
			<Container mode="vertical" size="small">
				<Container mode="horizontal">
					<Table horizontal variant="invisible" className="c-table_detail-page">
						<tbody>
							{renderDetailRow(
								renderAvatar(get(item, 'profile'), { small: false }),
								t('admin/users/views/user-detail___avatar')
							)}
							{renderSimpleDetailRows(item, [
								['first_name', t('admin/users/views/user-detail___voornaam')],
								['last_name', t('admin/users/views/user-detail___achternaam')],
								[
									'profile.alias',
									t('admin/users/views/user-detail___gebruikersnaam'),
								],
								['profile.title', t('admin/users/views/user-detail___functie')],
								['profile.bio', t('admin/users/views/user-detail___bio')],
								['stamboek', t('admin/users/views/user-detail___stamboek-nummer')],
								['mail', t('admin/users/views/user-detail___primair-email-adres')],
								[
									'profile.alternative_email',
									t('admin/users/views/user-detail___secundair-email-adres'),
								],
							])}
							{renderDetailRow(
								userGroup ? userGroup.label : '-',
								t('admin/users/views/user-detail___gebruikersgroep')
							)}
							{renderDateDetailRows(item, [
								[
									'acc_created_at',
									t('admin/users/views/user-detail___aangemaakt-op'),
								],
								[
									'acc_updated_at',
									t('admin/users/views/user-detail___aangepast-op'),
								],
								[
									'last_access_at',
									t('admin/users/views/user-detail___laatste-toegang'),
								],
							])}
							{renderSimpleDetailRows(item, [
								['business_category', t('admin/users/views/user-detail___oormerk')],
								[
									'is_exception',
									t('admin/users/views/user-detail___uitzonderingsaccount'),
								],
								['is_blocked', t('admin/users/views/user-detail___geblokkeerd')],
							])}
							{renderDateDetailRows(item, [
								[
									'last_blocked_at.aggregate.max.created_at',
									t('admin/users/views/user-detail___laatst-geblokeerd-op'),
								],
								[
									'last_unblocked_at.aggregate.max.created_at',
									t('admin/users/views/user-detail___laatst-gedeblokkeerd-op'),
								],
							])}
							{hasPerm(Permission.EDIT_USER_TEMP_ACCESS) &&
								renderDetailRow(
									renderTempAccess(tempAccess),
									t('admin/users/views/user-detail___tijdelijk-account')
								)}
							{hasPerm(Permission.EDIT_USER_TEMP_ACCESS) &&
								renderDetailRow(
									renderTempAccessDuration(tempAccess),
									t('admin/users/views/user-detail___totale-toegang')
								)}
							{renderDetailRow(
								idpMapsToTagList(
									get(item, 'idps', []).map((idpMap: any) => idpMap.idp),
									'idps'
								) || '-',
								t('admin/users/views/user-detail___gelinked-aan')
							)}
							{renderDetailRow(
								stringsToTagList(get(item, 'classifications', []), 'key') || '-',
								t('admin/users/views/user-detail___vakken')
							)}
							{renderDetailRow(
								get(item, 'contexts', [] as any[]).length ? (
									<TagList
										tags={get(item, 'contexts', []).map(
											(educationLevel: { key: string }): TagOption => ({
												id: educationLevel.key,
												label: educationLevel.key,
											})
										)}
										swatches={false}
										closable={false}
									/>
								) : (
									'-'
								),
								t('admin/users/views/user-detail___opleidingsniveaus')
							)}
							{renderDetailRow(
								eduOrgs.length ? (
									<TagList
										closable={false}
										swatches={false}
										tags={eduOrgs.map((eduOrg) => ({
											label: eduOrg.organization?.ldap_description || '',
											id: eduOrg.organization?.ldap_description || '',
										}))}
									/>
								) : (
									'-'
								),
								t('admin/users/views/user-detail___educatieve-organisaties')
							)}
							{renderDetailRow(
								get(item, 'company_name') || '-',
								t('admin/users/views/user-detail___bedrijf')
							)}
						</tbody>
					</Table>
				</Container>
			</Container>
		);
	};

	// Executed when the user was deleted
	const deleteCallback = () =>
		navigate(history, USER_PATH(AdminConfigManager.getConfig().route_parts).USER_OVERVIEW);

	const renderUserDetailPage = () => {
		return (
			<>
				{renderUserDetail()}

				<TempAccessModal
					tempAccess={tempAccess}
					isOpen={isTempAccessModalOpen}
					onClose={() => setIsTempAccessModalOpen(false)}
					setTempAccessCallback={onSetTempAccess}
				/>
				<ConfirmModal
					className="p-user-overview__confirm-modal"
					isOpen={isConfirmBlockUserModalVisible}
					onClose={() => {
						setIsConfirmBlockUserModalVisible(false);
						setShouldSendActionEmail(false);
					}}
					confirmCallback={async () => {
						setIsConfirmBlockUserModalVisible(false);
						setShouldSendActionEmail(false);
						await toggleBlockedStatus();
					}}
					title={t('admin/users/views/user-detail___bevestig')}
					confirmLabel={t('admin/users/views/user-detail___deactiveren')}
					size={'medium'}
					body={
						<>
							<strong>
								{t(
									'admin/users/views/user-detail___weet-je-zeker-dat-je-deze-gebruiker-wil-deactiveren'
								)}
							</strong>
							<Checkbox
								label={t(
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
					className="p-user-overview__confirm-modal"
					isOpen={isConfirmUnblockUserModalVisible}
					onClose={() => {
						setIsConfirmUnblockUserModalVisible(false);
						setShouldSendActionEmail(false);
					}}
					confirmCallback={async () => {
						setIsConfirmUnblockUserModalVisible(false);
						setShouldSendActionEmail(false);
						await toggleBlockedStatus();
					}}
					title={t('admin/users/views/user-detail___bevestig')}
					confirmLabel={t('admin/users/views/user-detail___opnieuw-activeren')}
					confirmButtonType={'primary'}
					size={'medium'}
					body={
						<>
							<strong>
								{t(
									'admin/users/views/user-detail___weet-je-zeker-dat-je-deze-gebruiker-opnieuw-wil-activeren'
								)}
							</strong>
							<Checkbox
								label={t(
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
				<UserDeleteModal
					selectedProfileIds={[get(item, 'profile_id')]}
					isOpen={userDeleteModalOpen}
					onClose={() => setUserDeleteModalOpen(false)}
					deleteCallback={deleteCallback}
				/>
			</>
		);
	};

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={item}
			render={renderUserDetailPage}
		/>
	);
};

export default UserDetail;
