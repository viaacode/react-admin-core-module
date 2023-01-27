import { isArray, isFunction, isPlainObject } from 'lodash-es';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';
import { RichEditorStateKey } from '../../../content-page/const/rich-text-editor.consts';
import { mockObject1, mockObject2 } from '../../../shared/helpers/map-deep/map-deep.mocks';
import { sanitizeHtml } from '../../../shared/helpers/sanitize';
import { mapDeep } from './map-deep';

describe('map-deep', () => {
	it('Should correctly map all levels of an object', () => {
		const resultObj = mapDeep(
			mockObject1,
			(obj, key, value) => {
				if (key === 'birthDay') {
					obj[key] = new Date(value);
				} else if (key === 'school2') {
					// Do nothing
				} else if (!isPlainObject(value) && !isArray(value)) {
					obj[key] = value;
				} else if (isPlainObject(value)) {
					obj[key] = {};
				} else {
					obj[key] = [];
				}
			},
			(key) => key === 'school2'
		);
		expect(resultObj.classes[0].birthDay).toEqual(new Date(mockObject1.classes[0].birthDay));
		expect(resultObj.classes[1].birthDay).toEqual(new Date(mockObject1.classes[1].birthDay));
		expect(resultObj.classes[2].birthDay).toEqual(new Date(mockObject1.classes[2].birthDay));
		expect(resultObj.school.location.birthDay).toEqual(
			new Date(mockObject1.school.location.birthDay)
		);
		expect(resultObj.school2).toBeUndefined();
		expect(resultObj.birthDay).toEqual(new Date(mockObject1.birthDay));
	});

	it('Should correctly map all RichTextEditor states to html', () => {
		const resultObj = mapDeep(
			[mockObject2],
			(obj: any, key: string | number, value: any) => {
				if (String(key).endsWith(RichEditorStateKey)) {
					const htmlKey: string = String(key).substring(
						0,
						String(key).length - RichEditorStateKey.length
					);
					let htmlFromRichTextEditor = undefined;
					if (value && value.toHTML && isFunction(value.toHTML)) {
						htmlFromRichTextEditor = value.toHTML();
					}
					obj[htmlKey] = sanitizeHtml(
						htmlFromRichTextEditor || obj[htmlKey] || '',
						SanitizePreset.full
					);
				} else if (!isPlainObject(value) && !isArray(value)) {
					obj[key] = value;
				} else if (isPlainObject(value)) {
					obj[key] = {};
				} else {
					obj[key] = [];
				}
			},
			(key: string | number) => String(key).endsWith(RichEditorStateKey)
		);
		expect(JSON.stringify(resultObj)).not.toContain('RichEditorState');
	});
});
