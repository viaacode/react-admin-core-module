import { FormGroup } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React from 'react';
import type { ActionMeta } from 'react-select';
import ReactSelect from 'react-select';
import { tText } from '~shared/helpers/translation-functions';
import { useGetAllThemes } from '~shared/hooks/useGetAllThemes';

interface ThemeOption {
	label: string;
	value: string;
}

export interface ThemeSelectProps {
	label: string | undefined;
	error: string | undefined;
	placeholder?: string;
	/** Id of the selected theme, or an empty string when nothing is picked yet. */
	value: string;
	required?: boolean;
	onChange: (selectedThemeId: string | null) => void;
}

/**
 * Picks exactly one theme. The options show the theme slug, not its Dutch or English name, and are
 * ordered alphabetically: https://meemoo.atlassian.net/wiki/spaces/HA2/pages/6218383419
 *
 * The slug is unique and language independent, so it identifies a theme in the editor without
 * making the admin pick a language. The visitor never sees a slug - the public side renders the
 * theme name in the UI language.
 */
export const ThemeSelect: FunctionComponent<ThemeSelectProps> = ({
	label,
	error,
	placeholder,
	value,
	required,
	onChange,
}) => {
	const { data: themes, isFetching } = useGetAllThemes();

	const themeOptions: ThemeOption[] = (themes || []).map((theme) => ({
		label: theme.slug,
		value: theme.id,
	}));

	const handleSelectionChanged = (
		newValue: ThemeOption | null,
		actionMeta: ActionMeta<ThemeOption>
	) => {
		if (actionMeta.action === 'select-option' && newValue) {
			onChange(newValue.value);
		} else {
			onChange(null);
		}
	};

	return (
		<FormGroup error={error} label={label} required={required} className="c-theme-select">
			<ReactSelect<ThemeOption>
				classNamePrefix="c-select"
				options={themeOptions}
				value={themeOptions.find((option) => option.value === value) || null}
				isLoading={isFetching}
				isClearable
				placeholder={
					placeholder ??
					tText('react-admin/modules/shared/components/theme-select/theme-select___kies-een-thema')
				}
				onChange={handleSelectionChanged}
				noOptionsMessage={() =>
					tText(
						'react-admin/modules/shared/components/theme-select/theme-select___geen-themas-gevonden'
					)
				}
				loadingMessage={() =>
					tText('react-admin/modules/shared/components/theme-select/theme-select___bezig-met-laden')
				}
			/>
		</FormGroup>
	);
};
