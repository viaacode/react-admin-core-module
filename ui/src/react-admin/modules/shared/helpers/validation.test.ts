import { describe, expect, it, vi } from 'vitest';

import type { ContentBlockComponentState } from '../../content-page/types/content-block.types';

import { validateContentBlockField } from './validation';

describe('validateContentBlockField', () => {
	it('should return the old errors when there is no validator', () => {
		const oldErrors = { someField: ['some error'] };

		expect(validateContentBlockField('someField', undefined, oldErrors, 'value')).toEqual(
			oldErrors
		);
	});

	it('should add the errors the validator returns', () => {
		const validator = () => ['this field is wrong'];

		expect(validateContentBlockField('someField', validator, {}, '')).toEqual({
			someField: ['this field is wrong'],
		});
	});

	it('should clear the error when the validator passes', () => {
		const validator = () => [];

		expect(
			validateContentBlockField('someField', validator, { someField: ['stale error'] }, 'ok')
		).toEqual({});
	});

	it('should index the errors by state index for repeatable blocks', () => {
		const validator = () => ['this field is wrong'];

		expect(validateContentBlockField('someField', validator, {}, '', 1)).toEqual({
			someField: [undefined, ['this field is wrong']],
		});
	});

	// Cross-field validation, used by the Videoblok start/end times.
	// https://meemoo.atlassian.net/browse/ARC-3832
	describe('sibling state', () => {
		it('should pass the sibling state to the validator', () => {
			const validator = vi.fn().mockReturnValue([]);
			const siblingState = { startTime: '00:00:10', endTime: '00:00:25' };

			validateContentBlockField(
				'endTime',
				validator,
				{},
				'00:00:25',
				undefined,
				siblingState as unknown as ContentBlockComponentState
			);

			expect(validator).toHaveBeenCalledWith('00:00:25', siblingState);
		});

		it('should let a validator report an error based on a sibling field', () => {
			// "both or none": an end time without a start time is invalid
			const validator = (
				value: string,
				siblingState?: { startTime?: string } | ContentBlockComponentState
			) =>
				value && !(siblingState as { startTime?: string })?.startTime
					? ['a start time is required as well']
					: [];

			expect(
				validateContentBlockField('endTime', validator, {}, '00:00:25', undefined, {
					startTime: '',
				} as unknown as ContentBlockComponentState)
			).toEqual({ endTime: ['a start time is required as well'] });

			expect(
				validateContentBlockField('endTime', validator, {}, '00:00:25', undefined, {
					startTime: '00:00:10',
				} as unknown as ContentBlockComponentState)
			).toEqual({});
		});

		it('should leave the sibling state undefined when it is not passed', () => {
			const validator = vi.fn().mockReturnValue([]);

			validateContentBlockField('someField', validator, {}, 'value');

			expect(validator).toHaveBeenCalledWith('value', undefined);
		});
	});
});
