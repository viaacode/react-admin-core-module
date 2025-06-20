import type { TagOption } from '@viaa/avo2-components';
import { TagList } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { LomSchemeType } from '@viaa/avo2-types';
import { compact, isNil } from 'lodash-es';
import type { ReactNode, ReactText } from 'react';
import { AdminConfigManager, ToastType } from '~core/config';
import type { History } from '~core/config/config.types';
import { hasTempAccess } from '~modules/user/helpers/has-temp-access';
import type { Idp, UserOverviewTableCol, UserTableState } from '~modules/user/user.types';
import ActionsDropdown from '~shared/components/ActionsDropdown/ActionsDropdown';
import { Icon } from '~shared/components/Icon';
import { Link } from '~shared/components/Link';
import { formatDateString } from '~shared/helpers/formatters/date';
import { idpMapsToTagList } from '~shared/helpers/idps-to-taglist';
import { isAvo } from '~shared/helpers/is-avo';
import { buildLink } from '~shared/helpers/link';
import { showToast } from '~shared/helpers/show-toast';
import { stringsToTagList } from '~shared/helpers/strings-to-taglist';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { truncateTableValue } from '~shared/helpers/truncate';

const handleOptionClicked = (profileId: string) => {
	navigator.clipboard.writeText(profileId);
	showToast({
		title: tText('modules/user/views/user-overview___success'),
		description: tText('admin/users/views/user-overview___uuid-gekopieerd'),
		type: ToastType.SUCCESS,
	});
};

export function renderUserOverviewTableCellReact(
	tableRowCommonUser: Avo.User.CommonUser,
	columnId: UserOverviewTableCol,
	info: {
		history: History;
		tableState: UserTableState;
		customFormatDate?: (date: Date | string) => string;
		navigateFilterToOption: (columnId: string) => (tagId: ReactText) => void;
	}
): ReactNode {
	const isBlocked = tableRowCommonUser?.isBlocked;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	const isKeyUser = (tableRowCommonUser as any)?.isKeyUser ?? false;

	switch (columnId) {
		case 'fullName':
			// no user detail for archief yet
			return isAvo() ? (
				<Link
					to={buildLink(AdminConfigManager.getAdminRoute('ADMIN_USER_DETAIL'), {
						id: tableRowCommonUser.profileId,
					})}
				>
					{truncateTableValue(tableRowCommonUser?.fullName)}
				</Link>
			) : (
				truncateTableValue(tableRowCommonUser?.fullName)
			);

		case 'email':
			return truncateTableValue(tableRowCommonUser?.email);

		case 'isBlocked':
			return isBlocked ? 'Ja' : 'Nee';

		case 'isKeyUser':
			return isKeyUser ? 'Ja' : 'Nee';

		case 'blockedAt':
			return formatDateString(tableRowCommonUser?.blockedAt) || '-';

		case 'unblockedAt':
			return formatDateString(tableRowCommonUser?.unblockedAt) || '-';

		case 'isException':
			return tableRowCommonUser?.isException ? 'Ja' : 'Nee';

		case 'organisation':
			return tableRowCommonUser?.organisation?.name || '-';

		case 'createdAt':
			return formatDateString(tableRowCommonUser.createdAt) || '-';

		case 'lastAccessAt': {
			const lastAccessDate = tableRowCommonUser?.lastAccessAt;
			return !isNil(lastAccessDate)
				? info.customFormatDate
					? info.customFormatDate(lastAccessDate)
					: formatDateString(lastAccessDate)
				: '-';
		}
		case 'tempAccess': {
			if (hasTempAccess(tableRowCommonUser?.tempAccess)) {
				return tHtml('admin/users/views/user-overview___tijdelijke-toegang-ja');
			} else {
				return tHtml('admin/users/views/user-overview___tijdelijke-toegang-nee');
			}
		}
		case 'tempAccessFrom':
			return formatDateString(tableRowCommonUser?.tempAccess?.from) || '-';

		case 'tempAccessUntil':
			return formatDateString(tableRowCommonUser?.tempAccess?.until) || '-';

		case 'idps':
			return (
				idpMapsToTagList(
					Object.keys(tableRowCommonUser?.idps || {}) as Idp[],
					`user_${tableRowCommonUser?.profileId}`,
					info.navigateFilterToOption(columnId)
				) || '-'
			);

		case 'educationLevels': {
			const labels = compact(
				(tableRowCommonUser?.loms ?? [])
					.filter((lom) => lom.lom?.scheme === LomSchemeType.structure)
					.map((lom) => lom.lom?.label)
			);
			return stringsToTagList(labels, null, info.navigateFilterToOption(columnId)) || '-';
		}

		case 'subjects': {
			const labels = compact(
				(tableRowCommonUser?.loms ?? [])
					.filter((lom) => lom.lom?.scheme === LomSchemeType.subject)
					.map((lom) => lom.lom?.label)
			);
			return stringsToTagList(labels, null, info.navigateFilterToOption(columnId)) || '-';
		}

		case 'educationalOrganisations': {
			const orgs: Avo.EducationOrganization.Organization[] =
				tableRowCommonUser.educationalOrganisations ?? [];
			const tags = orgs.map(
				(org): TagOption => ({
					id: `${org.organisationId}:${org.unitId || '-'}`,
					label: org.organisationLabel || org.unitId || org.organisationId,
				})
			);
			return (
				<TagList
					tags={tags}
					swatches={false}
					onTagClicked={info.navigateFilterToOption(columnId)}
				/>
			);
		}

		case 'userGroup':
			return truncateTableValue(
				tableRowCommonUser.userGroup?.label || tableRowCommonUser.userGroup?.name || '-'
			);

		case 'actions':
			return (
				<ActionsDropdown
					menuItems={[
						{
							id: tableRowCommonUser.profileId || '-',
							label:
								tableRowCommonUser.profileId ||
								tText('admin/users/views/user-overview___geen-uuid'),
							iconEnd: <Icon name="copy" />,
						},
					]}
					onOptionClicked={() => handleOptionClicked(tableRowCommonUser.profileId)}
				/>
			);

		default:
			return truncateTableValue(tableRowCommonUser[columnId] || '-');
	}
}

export function renderUserOverviewTableCellText(
	tableRowCommonUser: Avo.User.CommonUser,
	columnId: UserOverviewTableCol,
	info: {
		tableState: UserTableState;
		customFormatDate?: (date: Date | string) => string;
	}
): string {
	const isBlocked = tableRowCommonUser?.isBlocked;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	const isKeyUser = (tableRowCommonUser as any)?.isKeyUser ?? false;

	switch (columnId) {
		case 'fullName':
			return tableRowCommonUser?.fullName || '';

		case 'email':
			return tableRowCommonUser?.email || '';

		case 'isBlocked':
			return isBlocked ? 'Ja' : 'Nee';

		case 'isKeyUser':
			return isKeyUser ? 'Ja' : 'Nee';

		case 'blockedAt':
			return formatDateString(tableRowCommonUser?.blockedAt) || '';

		case 'unblockedAt':
			return formatDateString(tableRowCommonUser?.unblockedAt) || '';

		case 'isException':
			return tableRowCommonUser?.isException ? 'Ja' : 'Nee';

		case 'organisation':
			return tableRowCommonUser?.organisation?.name || '';

		case 'createdAt':
			return formatDateString(tableRowCommonUser.createdAt) || '';

		case 'lastAccessAt': {
			const lastAccessDate = tableRowCommonUser?.lastAccessAt;
			return !isNil(lastAccessDate)
				? info.customFormatDate
					? info.customFormatDate(lastAccessDate)
					: formatDateString(lastAccessDate)
				: '';
		}
		case 'tempAccess': {
			if (hasTempAccess(tableRowCommonUser?.tempAccess)) {
				return 'Ja';
			} else {
				return 'Nee';
			}
		}
		case 'tempAccessFrom':
			return formatDateString(tableRowCommonUser?.tempAccess?.from) || '';

		case 'tempAccessUntil':
			return formatDateString(tableRowCommonUser?.tempAccess?.until) || '';

		case 'idps':
			return (Object.keys(tableRowCommonUser?.idps || {}) as Idp[]).join(', ') || '';

		case 'educationLevels': {
			const labels = compact(
				(tableRowCommonUser?.loms ?? [])
					.filter((lom) => lom.lom?.scheme === LomSchemeType.structure)
					.map((lom) => lom.lom?.label)
			);
			return labels?.join(', ') || '';
		}

		case 'subjects': {
			const labels = compact(
				(tableRowCommonUser?.loms ?? [])
					.filter((lom) => lom.lom?.scheme === LomSchemeType.subject)
					.map((lom) => lom.lom?.label)
			);
			return labels?.join(', ') || '';
		}

		case 'educationalOrganisations': {
			const orgs: Avo.EducationOrganization.Organization[] =
				tableRowCommonUser.educationalOrganisations ?? [];
			return orgs
				.map((org): string => org.organisationLabel || org.unitId || org.organisationId)
				.join(', ');
		}

		case 'userGroup':
			return tableRowCommonUser.userGroup?.label || tableRowCommonUser.userGroup?.name || '';

		case 'actions':
			return '';

		default:
			return tableRowCommonUser[columnId] || '';
	}
}
