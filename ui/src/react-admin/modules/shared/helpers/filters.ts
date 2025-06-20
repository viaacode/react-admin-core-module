import { compact, isArray, isNil, set, without } from 'lodash-es';
import type { LomScheme } from '~shared/consts/lom-scheme.enum';

export const NULL_FILTER = 'null';

export function getQueryFilter(
	query: string | undefined,
	// biome-ignore lint/suspicious/noExplicitAny: todo
	getQueryFilterObj: (queryWildcard: string, query: string) => any[]
) {
	if (query) {
		return [
			{
				_or: getQueryFilterObj(`%${query}%`, query),
			},
		];
	}
	return [];
}

export function getDateRangeFilters<T>(
	filters: T,
	props: (keyof T)[],
	nestedProps?: string[]
	// biome-ignore lint/suspicious/noExplicitAny: todo
): any[] {
	return setNestedValues<T>(
		filters,
		props,
		nestedProps || (props as string[]),
		// biome-ignore lint/suspicious/noExplicitAny: todo
		(prop: string, value: any) => {
			return {
				[prop]: {
					...(value?.gte ? { _gte: value.gte } : null),
					...(value?.lte ? { _lte: value.lte } : null),
				},
			};
		}
	);
}

export function getBooleanFilters<T>(
	filters: T,
	props: (keyof T)[],
	nestedProps?: string[]
	// biome-ignore lint/suspicious/noExplicitAny: todo
): any[] {
	return setNestedValues<T>(
		filters,
		props,
		(nestedProps || props) as string[],
		// biome-ignore lint/suspicious/noExplicitAny: todo
		(prop: string, value: any) => {
			const orFilters = [];
			if (!value || !value.length) {
				return {};
			}
			if (value.includes(NULL_FILTER)) {
				orFilters.push({
					[prop]: { _is_null: true },
				});
			}
			orFilters.push(
				...without(value, NULL_FILTER).map((val) => ({
					[prop]: { _eq: val === 'true' },
				}))
			);
			return {
				_or: orFilters,
			};
		}
	);
}

/**
 * Used for fields where the user can select multiple values, but the object can only set one value
 * Example: userGroup
 * @param filters
 * @param props
 * @param nestedProps
 */
export function getMultiOptionFilters<T>(
	filters: T,
	props: (keyof T)[],
	nestedProps?: string[]
	// biome-ignore lint/suspicious/noExplicitAny: todo
): any[] {
	return setNestedValues(
		filters,
		props,
		nestedProps || (props as string[]),
		// biome-ignore lint/suspicious/noExplicitAny: todo
		(prop: string, value: any) => {
			if (isArray(value) && value.includes(NULL_FILTER)) {
				return {
					_or: [
						{ [prop]: { _is_null: true } }, // Empty value
						{ [prop]: { _in: without(value, NULL_FILTER) } }, // selected values
					],
				};
			}
			return { [prop]: { _in: value } };
		}
	);
}

/**
 * Used for generating a filter when the user can select multiple values and the field can also contain multiple values
 * Example: Subjects
 * @param filters
 * @param props
 * @param nestedReferenceTables
 * @param labelPaths
 * @param keyIn
 */
export function getMultiOptionsFilters<T>(
	filters: T,
	props: (keyof T)[],
	nestedReferenceTables: string[],
	labelPaths?: string[],
	keyIn?: boolean
	// biome-ignore lint/suspicious/noExplicitAny: todo
): any[] {
	return compact(
		props.map((prop: keyof T, index: number) => {
			// biome-ignore lint/suspicious/noExplicitAny: todo
			const filterValues = (filters as any)[prop];
			const nestedPathParts: string[] = nestedReferenceTables[index].split('.');
			const referenceTable: string | null = nestedPathParts.pop() || null;
			const nestedPath: string = nestedPathParts.join('.');
			const labelPath: string | null = labelPaths ? labelPaths[index] : null;

			if (
				isNil(filterValues) ||
				!isArray(filterValues) ||
				!filterValues.length ||
				!referenceTable
			) {
				return null;
			}

			// biome-ignore lint/suspicious/noExplicitAny: todo
			let nullFilters: any[] = [];
			// biome-ignore lint/suspicious/noExplicitAny: todo
			let otherValuesFilters: any[] = [];
			if (filterValues.includes(NULL_FILTER)) {
				// Empty value is selected
				nullFilters = [
					{
						_not: {
							[nestedPathParts[0]]: {}, // empty value => no reference table entries exist
						},
					},
				];
			}

			if (!filterValues.includes(NULL_FILTER) || filterValues.length > 1) {
				// other values are selected
				// selected values => referenceTable.props in selected values array
				otherValuesFilters = without(filterValues, NULL_FILTER).map((value: string) => {
					if (keyIn) {
						if (labelPath) {
							return {
								[referenceTable]: {
									[labelPath]: { _in: value },
								},
							};
						}
						return {
							[referenceTable]: { _in: value },
						};
					}
					if (labelPath) {
						return {
							[referenceTable]: {
								[labelPath]: { _has_keys_any: value },
							},
						};
					}
					return {
						[referenceTable]: { _has_keys_any: value },
					};
				});
			}

			if (nullFilters.length === 1 && otherValuesFilters.length === 0) {
				// Only empty value is selected
				return nullFilters[0];
			}

			// Set filter query on main query object
			if (nestedPath) {
				if (otherValuesFilters.length) {
					const otherValuesFiltersWrapper = {};
					set(otherValuesFiltersWrapper, nestedPath, {
						_or: otherValuesFilters,
					});
					return { _or: [...nullFilters, otherValuesFiltersWrapper] };
				}
			}

			return [...nullFilters, ...otherValuesFilters];
		})
	);
}

/**
 * Takes a filter object and a list of properties and outputs a valid graphql query object
 * @param filters object containing the filter props and values set by the ui
 * @param props which props should be added to the graphql query
 * @param nestedProps which props should be added to the graphql query in a nested fashion (matched to props by index in the array)
 * @param getValue function that returns the last part of the graphql query
 */
function setNestedValues<T>(
	filters: T,
	props: (keyof T)[],
	nestedProps: string[],
	// biome-ignore lint/suspicious/noExplicitAny: todo
	getValue: (prop: string, value: any) => any
	// biome-ignore lint/suspicious/noExplicitAny: todo
): any[] {
	return compact(
		// biome-ignore lint/suspicious/noExplicitAny: todo
		props.map((prop: keyof T, index: number): any => {
			// biome-ignore lint/suspicious/noExplicitAny: todo
			const value = (filters as any)[prop];
			if (!isNil(value) && (!isArray(value) || value.length)) {
				const nestedProp = nestedProps ? nestedProps[index] : String(prop);

				const lastProp = nestedProp.split('.').pop() as string;
				const path = nestedProp.substring(0, nestedProp.length - lastProp.length - 1);

				if (path) {
					const response = {};
					set(response, path, getValue(lastProp, value));
					return response;
				}
				return getValue(lastProp, value);
			}
			return null;
		})
	);
}

export function getLomFilter(
	selectedFilterOptions: string[] | undefined,
	scheme: LomScheme
	// biome-ignore lint/suspicious/noExplicitAny: todo
): any[] {
	if (!selectedFilterOptions || selectedFilterOptions.length === 0) {
		return [];
	}
	const nonNullFilterOptions = selectedFilterOptions.filter((level) => level !== NULL_FILTER);
	const hasNullFilter = nonNullFilterOptions.length !== selectedFilterOptions.length;

	const nonNullFilter = {
		loms: {
			lom_id: { _in: nonNullFilterOptions },
			lom: {
				scheme: { _eq: scheme },
			},
		},
	};

	const nullFilter = {
		_not: {
			loms: {
				lom: {
					scheme: {
						_eq: scheme,
					},
				},
			},
		},
	};

	const orList = [];
	if (nonNullFilterOptions.length) {
		orList.push(nonNullFilter);
	}
	if (hasNullFilter) {
		orList.push(nullFilter);
	}

	return [
		{
			_or: orList,
		},
	];
}
