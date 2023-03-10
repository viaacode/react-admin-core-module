import { ContentPageLabelDto, PickerItemDto } from "./content-page-label.dto";

describe('ContentPageLabelDto', () => {
	describe('PickerItemDto', () => {
		it('should be able to construct a PickerItemDto object', () => {
			const pickerItemDto = new PickerItemDto();
			expect(pickerItemDto).toEqual({});
		});
	});

	describe('ContentPageLabelDto', () => {
		it('should be able to construct a ContentPageLabelDto object', () => {
			const contentPageLabelDto = new ContentPageLabelDto();
			expect(contentPageLabelDto).toEqual({});
		});
	});

});
