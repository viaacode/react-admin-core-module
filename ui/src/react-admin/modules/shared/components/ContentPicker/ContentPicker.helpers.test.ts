import { AvoCoreContentPickerType, AvoCoreDatabaseType } from '@viaa/avo2-types';
import { describe, expect, it, vi } from 'vitest';
import { AdminConfigManager } from '~core/config/config.class';

import { GET_CONTENT_TYPES } from './ContentPicker.const';
import { filterTypes } from './ContentPicker.helpers';

// The item providers pull in services that are not needed to filter the picker types
vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
	tHtml: (key: string) => key,
}));

const AVO_ONLY_TYPES = [
	AvoCoreContentPickerType.COLLECTION,
	AvoCoreContentPickerType.ITEM,
	AvoCoreContentPickerType.BUNDLE,
	AvoCoreContentPickerType.ASSIGNMENT,
	AvoCoreContentPickerType.PROJECTS,
];

// The link types offered by the buttons of the image and buttons content blocks
const IMAGE_BUTTON_TYPES = [
	AvoCoreContentPickerType.ITEM,
	AvoCoreContentPickerType.COLLECTION,
	AvoCoreContentPickerType.BUNDLE,
	AvoCoreContentPickerType.ASSIGNMENT,
	AvoCoreContentPickerType.CONTENT_PAGE,
	AvoCoreContentPickerType.PROJECTS,
	AvoCoreContentPickerType.INTERNAL_LINK,
	AvoCoreContentPickerType.EXTERNAL_LINK,
	AvoCoreContentPickerType.ANCHOR_LINK,
	AvoCoreContentPickerType.FILE,
];

function setApp(databaseType: AvoCoreDatabaseType) {
	AdminConfigManager.setConfig({
		env: { DATABASE_APPLICATION_TYPE: databaseType },
	} as never);
}

describe('filterTypes', () => {
	it('marks every content picker type with at least one app', () => {
		setApp(AvoCoreDatabaseType.avo);
		for (const type of GET_CONTENT_TYPES()) {
			expect(type.apps.length, type.value).toBeGreaterThan(0);
		}
	});

	it('leaves out the AvO only types in hetarchief', () => {
		setApp(AvoCoreDatabaseType.hetArchief);
		const types = filterTypes(GET_CONTENT_TYPES(), IMAGE_BUTTON_TYPES).map((type) => type.value);

		expect(types).toEqual([
			AvoCoreContentPickerType.CONTENT_PAGE,
			AvoCoreContentPickerType.INTERNAL_LINK,
			AvoCoreContentPickerType.EXTERNAL_LINK,
			AvoCoreContentPickerType.ANCHOR_LINK,
			AvoCoreContentPickerType.FILE,
		]);
	});

	it('keeps the AvO only types in AvO', () => {
		setApp(AvoCoreDatabaseType.avo);
		const types = filterTypes(GET_CONTENT_TYPES(), IMAGE_BUTTON_TYPES).map((type) => type.value);

		for (const avoType of AVO_ONLY_TYPES) {
			expect(types).toContain(avoType);
		}
		expect(types).toHaveLength(IMAGE_BUTTON_TYPES.length);
	});

	it('leaves out the hetarchief only types in AvO', () => {
		setApp(AvoCoreDatabaseType.avo);
		const types = filterTypes(GET_CONTENT_TYPES(), [
			AvoCoreContentPickerType.IE_OBJECT,
			AvoCoreContentPickerType.CONTENT_PAGE,
		]).map((type) => type.value);

		expect(types).toEqual([AvoCoreContentPickerType.CONTENT_PAGE]);
	});

	it('filters on app when no allowed types are passed', () => {
		setApp(AvoCoreDatabaseType.hetArchief);
		const types = filterTypes(GET_CONTENT_TYPES(), []).map((type) => type.value);

		for (const avoType of AVO_ONLY_TYPES) {
			expect(types).not.toContain(avoType);
		}
		expect(types).toContain(AvoCoreContentPickerType.IE_OBJECT);
	});
});
