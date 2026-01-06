import { uniq } from 'es-toolkit';
import { SpecialUserGroups } from '~shared/types/authentication.types.ts';

/**
 * Checks if the currentUserGroupIds has access to the content based on the requiredUserGroupIds
 * Both groups can contain SpecialUserGroups:
 * - loggedOutUsers = '-1',
 * - loggedInUsers = '-2',
 * - allContent = '-3',
 * Avo user group ids are numbers. eg: '1', '2', ...
 * Hetarchief user group ids are uuid's
 */
export function hasAccessUserGroups(
	currentUserGroupId: string,
	requiredUserGroupIds: string[] | null | undefined
): boolean {
	const current = currentUserGroupId;
	const required = uniq(requiredUserGroupIds ?? []);

	if (required.includes(SpecialUserGroups.allContent)) {
		throw new Error('Required user group cannot contain the "all content" -3 special user group');
	}

	// No restrictions => accessible
	if (required.length === 0) {
		return true;
	}

	if (!current) {
		if (required.length > 0) {
			// Some required user groups and user has no user group => no access
			return false;
		} else {
			// No required user groups and no user group ids => access
			return true;
		}
	}

	if (currentUserGroupId === SpecialUserGroups.allContent) {
		return true;
	}

	const isCurrentSpecial = (Object.values(SpecialUserGroups) as string[]).includes(current);

	// Determine login state (defensive: current may also contain special ids)
	const isLoggedOut = current.length === 0 || current.includes(SpecialUserGroups.loggedOutUsers);

	const isLoggedIn = !isCurrentSpecial || current === SpecialUserGroups.loggedInUsers;

	// Special group-based access
	if (required.includes(SpecialUserGroups.loggedOutUsers) && isLoggedOut) {
		return true;
	}
	if (required.includes(SpecialUserGroups.loggedInUsers) && isLoggedIn) {
		return true;
	}

	// Regular group intersection check (numbers/uuids)
	const requiredRegular = required.filter((id) => !isSpecial(id));
	if (requiredRegular.length === 0) {
		// Only specials were required and none matched above
		return false;
	}

	return requiredRegular.includes(current);
}

const isSpecial = (id: string) => {
	return (Object.values(SpecialUserGroups) as string[]).includes(id);
};
