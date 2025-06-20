import { Alert, Select, Spacer } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { pullAllBy, remove, uniq } from 'lodash-es';
import type { FunctionComponent, ReactText } from 'react';
import React, { useEffect, useState } from 'react';

import { AdminConfigManager, ToastType } from '~core/config';
import { AVO } from '~modules/shared/types';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { stringsToTagList } from '../../helpers/strings-to-taglist';

export interface Tag {
	label: string;
	id: string;
}

export interface EducationalOrganisationsSelectProps {
	organisations: Avo.EducationOrganization.Organization[];
	onChange: (organisations: Avo.EducationOrganization.Organization[]) => void;
	disabled?: boolean;
	showSelectedValuesOnCollapsed?: boolean;
}

export const EducationalOrganisationsSelect: FunctionComponent<
	EducationalOrganisationsSelectProps
> = ({ organisations, onChange, disabled = false }) => {
	const [cities, setCities] = useState<string[]>([]);
	const [organisationsInCity, setOrganisationsInCity] = useState<
		Avo.EducationOrganization.Organization[]
	>([]);
	const [selectedCity, setSelectedCity] = useState<string>('');
	const [organizationsLoadingState, setOrganizationsLoadingState] = useState<
		'loading' | 'loaded' | 'error'
	>('loaded');

	// Cache organizations since the user will probably select multiple schools in the same city
	const [organisationsCache, setOrganisationsCache] = useState<{
		[cityAndZipCode: string]: Avo.EducationOrganization.Organization[];
	}>({});

	useEffect(() => {
		AdminConfigManager.getConfig()
			.services.educationOrganisationService.fetchCities()
			.then(setCities)
			// biome-ignore lint/suspicious/noExplicitAny: todo
			.catch((err: any) => {
				console.error(err);
				console.error(new Error('Failed to get cities'));
				showToast({
					title: tText(
						'modules/admin/shared/components/educational-organisations-select/educational-organisations-select___ophalen-mislukt',
						{},
						[AVO]
					),
					description: tText(
						'settings/components/organisation___het-ophalen-van-de-steden-is-mislukt',
						{},
						[AVO]
					),
					type: ToastType.ERROR,
				});
			});
	}, []);

	useEffect(() => {
		(async () => {
			try {
				if (!selectedCity) {
					return;
				}
				setOrganizationsLoadingState('loading');
				const [city, zipCode] = selectedCity.split(/[()]/g).map((s) => s.trim());
				let orgs: Avo.EducationOrganization.Organization[];
				if (organisationsCache[selectedCity]) {
					// get from cache
					orgs = [...organisationsCache[selectedCity]];
				} else {
					// fetch from server
					orgs =
						await AdminConfigManager.getConfig().services.educationOrganisationService.fetchEducationOrganisations(
							city,
							zipCode
						);
					setOrganisationsCache({
						...organisationsCache,
						...{ [selectedCity]: orgs },
					});
				}
				pullAllBy(orgs, organisations, 'label');
				setOrganisationsInCity(orgs);
				setOrganizationsLoadingState('loaded');
			} catch (err) {
				setOrganisationsInCity([]);
				setOrganizationsLoadingState('loaded');
				console.error('Failed to get educational organizations', err, {
					selectedCity,
				});
				showToast({
					title: tText(
						'modules/admin/shared/components/educational-organisations-select/educational-organisations-select___mislukt',
						{},
						[AVO]
					),
					description: tText(
						'settings/components/organisation___het-ophalen-van-de-onderwijsinstellingen-is-mislukt',
						{},
						[AVO]
					),
					type: ToastType.ERROR,
				});
			}
		})();
	}, [organisationsCache, organisations, selectedCity]);

	const onSelectedCityChanged = async (cityAndZipCode: string) => {
		setSelectedCity(cityAndZipCode);
	};

	const onSelectedOrganisationChanged = (orgLabel: string) => {
		const selectedOrg = organisationsInCity.find(
			(org: Avo.EducationOrganization.Organization) => org.organisationLabel === orgLabel
		);
		if (!selectedOrg) {
			showToast({
				title: tText(
					'modules/admin/shared/components/educational-organisations-select/educational-organisations-select___mislukt',
					{},
					[AVO]
				),
				description: tText(
					'settings/components/organisation___de-geselecteerde-instelling-kon-niet-worden-gevonden',
					{},
					[AVO]
				),
				type: ToastType.ERROR,
			});
			return;
		}
		const selectedOrgs: Avo.EducationOrganization.Organization[] = [
			...organisations,
			...[selectedOrg],
		];
		onChange(uniq(selectedOrgs));
	};

	const removeOrganisation = async (orgLabel: ReactText) => {
		const newOrganizations = [...organisations];
		remove(newOrganizations, (org) => org.organisationLabel === orgLabel);
		onChange(newOrganizations);
	};

	const getOrganisationOptions = () => {
		if (organisationsInCity.length === 0 && organizationsLoadingState === 'loaded') {
			return [
				{
					label: tText(
						'settings/components/organisation___er-zijn-geen-andere-organisaties-gekend-in-deze-gemeente',
						{},
						[AVO]
					),
					value: '',
					disabled: true,
				},
			];
		}
		return [
			{
				label: tText('settings/components/organisation___selecteer-een-instelling', {}, [AVO]),
				value: '',
				disabled: true,
			},
			...organisationsInCity.map((org: Avo.EducationOrganization.Organization) => ({
				label: org.organisationLabel,
				value: org.organisationLabel,
			})),
		];
	};

	const renderOrganisationTagsAndSelects = () => {
		return (
			<>
				{stringsToTagList(organisations, 'label', undefined, removeOrganisation)}
				<Spacer margin="top-small">
					<Select
						options={[
							{
								label: tText('settings/components/profile___voeg-een-organisatie-toe', {}, [AVO]),
								value: '',
							},
							...(cities || []).map((c) => ({ label: c, value: c })),
						]}
						value={selectedCity || ''}
						onChange={onSelectedCityChanged}
					/>
				</Spacer>
				<Spacer margin={['top-small', 'bottom-small']}>
					{organizationsLoadingState === 'loading' && (
						<Alert
							type="spinner"
							message={tHtml(
								'settings/components/profile___bezig-met-ophalen-van-organisaties',
								{},
								[AVO]
							)}
						/>
					)}
					{!!selectedCity && organizationsLoadingState === 'loaded' && (
						<Select
							options={getOrganisationOptions()}
							value={''}
							onChange={onSelectedOrganisationChanged}
						/>
					)}
				</Spacer>
			</>
		);
	};

	if (disabled) {
		return (
			<div className={clsx({ 'u-opacity-50 u-disable-click': disabled })}>
				{renderOrganisationTagsAndSelects()}
			</div>
		);
	}

	return renderOrganisationTagsAndSelects();
};
