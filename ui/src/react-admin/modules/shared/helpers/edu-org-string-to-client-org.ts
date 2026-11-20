import type { AvoEducationOrganizationOrganization } from '@viaa/avo2-types';

/**
 * Converts the filter values stored in the url (`organisationId:unitId`) to organisation objects.
 * The url only contains the ids, so the label is set to the organisation id until the real name is resolved.
 */
export function eduOrgToClientOrg(orgs: string[]): AvoEducationOrganizationOrganization[] {
	return (orgs || []).map((org) => {
		const parts = org.split(':');
		return {
			organisationId: parts[0].trim(),
			organisationLabel: parts[0].trim(),
			unitId: (parts[1] || '').trim() || null,
			unitStreet: null,
		};
	});
}

/**
 * Unique key for an educational organisation, in the same format as the filter values in the url: `organisationId:unitId`
 * The label is not unique, since multiple units of the same organisation can have the same name
 */
export function getEducationOrganisationKey(org: AvoEducationOrganizationOrganization): string {
	return `${org.organisationId}:${org.unitId || ''}`;
}

export function getEducationOrganisationDisplayLabel(
	org: AvoEducationOrganizationOrganization
): string {
	return org.organisationLabel + (org.unitStreet ? ` - ${org.unitStreet}` : '');
}
