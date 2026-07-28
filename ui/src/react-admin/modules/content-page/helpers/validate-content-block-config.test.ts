import { describe, expect, it } from 'vitest';
import type {
	ContentBlockConfig,
	ContentBlockFieldGroupErrors,
} from '../types/content-block.types';
import { validateContentBlockConfig } from './validate-content-block-config';

const required = (message: string) => (value: string) => (value ? [] : [message]);

// A block config modelled on the mechanism-B blocks (e.g. BlockOverviewWithCarousel):
// a scalar `title` field alongside a repeated `elements` field group whose inner
// fields carry the validators. `title` intentionally appears at both levels to guard
// against error-key collisions.
const makeFields = () => ({
	title: {
		editorType: 'TextInput' as never,
		validator: required('block title required'),
	},
	elements: {
		type: 'fieldGroup' as const,
		label: 'Content item',
		repeat: { defaultState: {} },
		fields: {
			image: {
				editorType: 'FileUpload' as never,
				validator: required('image required'),
			},
			title: {
				editorType: 'TextInput' as never,
				validator: required('item title required'),
			},
			itemDisplay: {
				editorType: 'Select' as never,
				validator: required('display required'),
			},
		},
	},
});

const makeConfig = (state: unknown): ContentBlockConfig =>
	({ components: { state, fields: makeFields() } }) as unknown as ContentBlockConfig;

describe('validateContentBlockConfig - field groups (mechanism B)', () => {
	it('reports an error per invalid inner field, keyed by element index', () => {
		const state = {
			title: 'ok',
			elements: [
				{ image: 'img.jpg', title: 'Item 1', itemDisplay: '16:9' }, // valid
				{ image: '', title: '', itemDisplay: '' }, // all missing
			],
		};

		const errors = validateContentBlockConfig({}, makeConfig(state), makeFields(), state as never);

		const groupErrors = errors.elements as ContentBlockFieldGroupErrors;
		expect(groupErrors[0]).toEqual({}); // first element is valid
		expect(groupErrors[1]).toEqual({
			image: ['image required'],
			title: ['item title required'],
			itemDisplay: ['display required'],
		});
	});

	it('does not collide the element title with the block-level title', () => {
		const state = {
			title: '', // block-level invalid
			elements: [{ image: 'img.jpg', title: '', itemDisplay: '16:9' }], // element title invalid
		};

		const errors = validateContentBlockConfig({}, makeConfig(state), makeFields(), state as never);

		expect(errors.title).toEqual(['block title required']); // scalar field untouched
		expect((errors.elements as ContentBlockFieldGroupErrors)[0]).toEqual({
			title: ['item title required'],
		});
	});

	it('clears the group key when every element becomes valid', () => {
		const state = {
			title: 'ok',
			elements: [{ image: 'img.jpg', title: 'Item 1', itemDisplay: '16:9' }],
		};

		const errors = validateContentBlockConfig(
			{ elements: [{ image: ['image required'] }] },
			makeConfig(state),
			makeFields(),
			state as never
		);

		expect(errors.elements).toBeUndefined();
	});
});
