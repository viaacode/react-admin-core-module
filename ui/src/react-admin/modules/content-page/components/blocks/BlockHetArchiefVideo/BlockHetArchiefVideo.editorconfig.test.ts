import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { describe, expect, it, vi } from 'vitest';

import type {
	ContentBlockComponentState,
	ContentBlockField,
} from '~modules/content-page/types/content-block.types';
import {
	ContentBlockEditor,
	ContentBlockType,
} from '~modules/content-page/types/content-block.types';

import {
	HETARCHIEF_VIDEO_BLOCK_CONFIG,
	type HetArchiefVideoBlockComponentState,
	INITIAL_HETARCHIEF_VIDEO_COMPONENTS_STATE,
} from './BlockHetArchiefVideo.editorconfig';

// Building the config resolves every label and the shared block-level fields, both of which
// otherwise read the admin-core config. Same approach as BlockHetArchiefQuote.editorconfig.test.
vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
	tHtml: (key: string) => key,
}));

vi.mock('~shared/helpers/is-avo', () => ({
	isAvo: () => false,
}));

const fields = () =>
	HETARCHIEF_VIDEO_BLOCK_CONFIG().components.fields as Record<string, ContentBlockField>;

const validate = (
	field: 'startTime' | 'endTime',
	state: Partial<HetArchiefVideoBlockComponentState>
): string[] => {
	const validator = fields()[field].validator;

	if (!validator) {
		throw new Error(`Expected the ${field} field to have a validator`);
	}
	return validator(state[field], state as ContentBlockComponentState);
};

describe('HETARCHIEF_VIDEO_BLOCK_CONFIG', () => {
	it('should be of the HetArchiefVideo type', () => {
		expect(HETARCHIEF_VIDEO_BLOCK_CONFIG().type).toEqual(ContentBlockType.HetArchiefVideo);
	});

	it('should offer only AV objects in the object picker', () => {
		const mediaItem = fields().mediaItem;

		expect(mediaItem.editorType).toEqual(ContentBlockEditor.ContentPicker);
		expect(mediaItem.editorProps.allowedTypes).toEqual([AvoCoreContentPickerType.IE_OBJECT]);
		expect(mediaItem.editorProps.ieObjectFormats).toEqual([
			'audio',
			'audiofragment',
			'film',
			'video',
			'videofragment',
		]);
	});

	it('should require an object', () => {
		const validator = fields().mediaItem.validator;

		expect(validator?.(undefined)).toHaveLength(1);
		expect(validator?.({ type: AvoCoreContentPickerType.IE_OBJECT, value: 'qs6d5p9579' })).toEqual(
			[]
		);
	});

	it('should show the copyright caption fields, with the icon on by default', () => {
		const state = INITIAL_HETARCHIEF_VIDEO_COMPONENTS_STATE();

		expect(state.copyrightIconVisible).toBe(true);
		expect(state.copyrightTitle).toEqual('');
		expect(state.copyrightText).toEqual('');
		expect(Object.keys(fields())).toEqual(
			expect.arrayContaining(['copyrightTitle', 'copyrightIconVisible', 'copyrightText'])
		);
	});

	it('should not carry over the AvO annotation and showCopyright fields', () => {
		expect(Object.keys(fields())).not.toEqual(
			expect.arrayContaining(['annotationTitle', 'annotationText', 'showCopyright', 'src'])
		);
	});

	describe('snippet time validation', () => {
		it('should accept HH:MM:SS', () => {
			const state = { startTime: '00:00:10', endTime: '00:01:30' };

			expect(validate('startTime', state)).toEqual([]);
			expect(validate('endTime', state)).toEqual([]);
		});

		it('should accept MM:SS', () => {
			const state = { startTime: '00:10', endTime: '01:30' };

			expect(validate('startTime', state)).toEqual([]);
			expect(validate('endTime', state)).toEqual([]);
		});

		it('should accept both being empty, so the whole object plays', () => {
			const state = { startTime: '', endTime: '' };

			expect(validate('startTime', state)).toEqual([]);
			expect(validate('endTime', state)).toEqual([]);
		});

		// The media service only cuts when it gets an end time, so half a pair is rejected.
		it('should reject a start time without an end time', () => {
			const state = { startTime: '00:00:10', endTime: '' };

			expect(validate('startTime', state)).toEqual([]);
			expect(validate('endTime', state)).toHaveLength(1);
		});

		it('should reject an end time without a start time', () => {
			const state = { startTime: '', endTime: '00:01:30' };

			expect(validate('startTime', state)).toHaveLength(1);
			expect(validate('endTime', state)).toEqual([]);
		});

		it('should reject an end time that is not after the start time', () => {
			expect(validate('endTime', { startTime: '00:01:30', endTime: '00:00:10' })).toHaveLength(1);
			expect(validate('endTime', { startTime: '00:01:30', endTime: '00:01:30' })).toHaveLength(1);
		});

		it('should report the ordering problem on the end time only, not twice', () => {
			const state = { startTime: '00:01:30', endTime: '00:00:10' };

			expect(validate('startTime', state)).toEqual([]);
			expect(validate('endTime', state)).toHaveLength(1);
		});

		it.each(['nonsense', '90', '00:60', '00:00:60', '00:01:30.500', '1:2:3:4'])(
			'should reject the malformed time "%s"',
			(value) => {
				expect(validate('startTime', { startTime: value, endTime: '01:00:00' })).toHaveLength(1);
			}
		);

		it('should accept a snippet starting at 0', () => {
			const state = { startTime: '00:00:00', endTime: '00:00:30' };

			expect(validate('startTime', state)).toEqual([]);
			expect(validate('endTime', state)).toEqual([]);
		});

		it('should re-validate the other time field when one changes', () => {
			expect(fields().startTime.revalidateFields).toEqual(['endTime']);
			expect(fields().endTime.revalidateFields).toEqual(['startTime']);
		});
	});
});
