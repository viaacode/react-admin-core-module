import { Alert, Select, Spacer } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { ClientEducationOrganization } from '@viaa/avo2-types/types/education-organizations';
import clsx from 'clsx';
import { pullAllBy, remove, uniq } from 'lodash-es';
import React, { FunctionComponent, ReactText, useEffect, useState } from 'react';

import { stringsToTagList } from '../../helpers/strings-to-taglist';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

export interface Tag {
	label: string;
	id: string;
}

export interface EducationalOrganisationsSelectProps {
	organisations: ClientEducationOrganization[];
	onChange: (organisations: ClientEducationOrganization[]) => void;
	disabled?: boolean;
	showSelectedValuesOnCollapsed?: boolean;
}

export const EducationalOrganisationsSelect: FunctionComponent<
	EducationalOrganisationsSelectProps
> = ({ organisations, onChange, disabled = false }) => {
	const { t } = useTranslation();

	const [cities, setCities] = useState<string[]>([]);
	const [organisationsInCity, setOrganisationsInCity] = useState<ClientEducationOrganization[]>(
		[]
	);
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
			.catch((err: any) => {
				console.error(err);
				console.error(new Error('Failed to get cities'));
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: t(
						'modules/admin/shared/components/educational-organisations-select/educational-organisations-select___ophalen-mislukt'
					),
					description: t(
						'settings/components/organisation___het-ophalen-van-de-steden-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			});
	}, [setCities, t]);

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
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: t(
						'modules/admin/shared/components/educational-organisations-select/educational-organisations-select___mislukt'
					),
					description: t(
						'settings/components/organisation___het-ophalen-van-de-onderwijsinstellingen-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			}
		})();
	}, [
		organisationsCache,
		organisations,
		selectedCity,
		setOrganisationsInCity,
		setOrganizationsLoadingState,
		onChange,
		t,
	]);

	const onSelectedCityChanged = async (cityAndZipCode: string) => {
		setSelectedCity(cityAndZipCode);
	};

	const onSelectedOrganisationChanged = (orgLabel: string) => {
		const selectedOrg = organisationsInCity.find(
			(org: ClientEducationOrganization) => org.label === orgLabel
		);
		if (!selectedOrg) {
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: t(
					'modules/admin/shared/components/educational-organisations-select/educational-organisations-select___mislukt'
				),
				description: t(
					'settings/components/organisation___de-geselecteerde-instelling-kon-niet-worden-gevonden'
				),
				type: ToastType.ERROR,
			});
			return;
		}
		const selectedOrgs: ClientEducationOrganization[] = [...organisations, ...[selectedOrg]];
		onChange(uniq(selectedOrgs));
	};

	const removeOrganisation = async (orgLabel: ReactText) => {
		const newOrganizations = [...organisations];
		remove(newOrganizations, (org) => org.label === orgLabel);
		onChange(newOrganizations);
	};

	const getOrganisationOptions = () => {
		if (organisationsInCity.length === 0 && organizationsLoadingState === 'loaded') {
			return [
				{
					label: t(
						'settings/components/organisation___er-zijn-geen-andere-organisaties-gekend-in-deze-gemeente'
					),
					value: '',
					disabled: true,
				},
			];
		}
		return [
			{
				label: t('settings/components/organisation___selecteer-een-instelling'),
				value: '',
				disabled: true,
			},
			...organisationsInCity.map((org: Avo.EducationOrganization.Organization) => ({
				label: org.label,
				value: org.label,
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
								label: t('settings/components/profile___voeg-een-organisatie-toe'),
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
							message={t(
								'settings/components/profile___bezig-met-ophalen-van-organisaties'
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
