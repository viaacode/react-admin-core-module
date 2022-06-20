import { mapDeep } from './map-deep';
import { isArray, isPlainObject } from 'lodash-es';

const mockObject = {
	classes: [
		{
			birthDay: '2000-12-12',
			name: 'george',
		},
		{
			birthDay: '2001-12-12',
			name: 'kate',
		},
		{
			birthDay: '2002-12-12',
			name: 'john',
		},
	],
	school: {
		name: 'highschool1',
		location: {
			street: 'highstreet 13',
			birthDay: '2022-12-12',
		},
	},
	school2: {
		name: 'highschool1',
		location: {
			street: 'highstreet 13',
			birthDay: '2022-12-12',
		},
	},
	birthDay: '2022-12-12',
};

describe('map-deep', () => {
	it('Should correctly map all levels of an object', () => {
		const resultObj = mapDeep(
			mockObject,
			(obj, key, value) => {
				if (key === 'birthDay') {
					obj[key] = new Date(value);
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
		expect(resultObj.classes[0].birthDay).toEqual(new Date(mockObject.classes[0].birthDay));
		expect(resultObj.classes[1].birthDay).toEqual(new Date(mockObject.classes[1].birthDay));
		expect(resultObj.classes[2].birthDay).toEqual(new Date(mockObject.classes[2].birthDay));
		expect(resultObj.school.location.birthDay).toEqual(
			new Date(mockObject.school.location.birthDay)
		);
		expect(resultObj.school2.location.birthDay).toEqual(mockObject.school2.location.birthDay);
		expect(resultObj.birthDay).toEqual(new Date(mockObject.birthDay));
	});
});
