import { Alert, Select, Spacer, TagList } from '@viaa/avo2-components';
import type { AvoEducationOrganizationOrganization } from '@viaa/avo2-types';
import clsx from 'clsx';
import { uniqBy } from 'es-toolkit';
import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { ToastType } from '~core/config/config.types';
import { AVO } from '~modules/shared/types';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import {
	getEducationOrganisationDisplayLabel,
	getEducationOrganisationKey,
} from '../../helpers/edu-org-string-to-client-org';

export interface Tag {
	label: string;
	id: string;
}

type ReactText = string | number;

export interface EducationalOrganisationsSelectProps {
	organisations: AvoEducationOrganizationOrganization[];
	onChange: (organisations: AvoEducationOrganizationOrganization[]) => void;
	disabled?: boolean;
	showSelectedValuesOnCollapsed?: boolean;
}

export const EducationalOrganisationsSelect: FunctionComponent<
	EducationalOrganisationsSelectProps
> = ({ organisations, onChange, disabled = false }) => {
	const [cities, setCities] = useState<string[]>([]);
	const [organisationsInCity, setOrganisationsInCity] = useState<
		AvoEducationOrganizationOrganization[]
	>([]);
	const [selectedCity, setSelectedCity] = useState<string>('');
	const [organizationsLoadingState, setOrganizationsLoadingState] = useState<
		'loading' | 'loaded' | 'error'
	>('loaded');

	// Cache organizations since the user will probably select multiple schools in the same city
	const [organisationsCache, setOrganisationsCache] = useState<{
		[cityAndZipCode: string]: AvoEducationOrganizationOrganization[];
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
				let orgs: AvoEducationOrganizationOrganization[];
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
				// Hide the organisations that are already selected
				// Do not mutate orgs, since it can be the array that is stored in the cache
				const selectedKeys = new Set(organisations.map(getEducationOrganisationKey));
				setOrganisationsInCity(
					orgs.filter((org) => !selectedKeys.has(getEducationOrganisationKey(org)))
				);
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

	const onSelectedOrganisationChanged = (orgKey: string) => {
		const selectedOrg = organisationsInCity.find(
			(org: AvoEducationOrganizationOrganization) => getEducationOrganisationKey(org) === orgKey
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
		const selectedOrgs: AvoEducationOrganizationOrganization[] = [
			...organisations,
			...[selectedOrg],
		];
		onChange(uniqBy(selectedOrgs, getEducationOrganisationKey));
	};

	const removeOrganisation = (orgKey: ReactText) => {
		onChange(organisations.filter((org) => getEducationOrganisationKey(org) !== orgKey));
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
			...organisationsInCity.map((org: AvoEducationOrganizationOrganization) => ({
				label: getEducationOrganisationDisplayLabel(org),
				value: getEducationOrganisationKey(org),
			})),
		];
	};

	const renderOrganisationTagsAndSelects = () => {
		return (
			<>
				{!!organisations.length && (
					<TagList
						tags={organisations.map((org) => ({
							id: getEducationOrganisationKey(org),
							label: getEducationOrganisationDisplayLabel(org),
						}))}
						closable
						onTagClosed={removeOrganisation}
						swatches={false}
					/>
				)}
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
