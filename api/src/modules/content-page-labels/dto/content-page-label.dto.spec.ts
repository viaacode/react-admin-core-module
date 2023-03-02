import { ContentPageLabelDto, PickerItemDto } from "./content-page-label.dto";

describe('ContentPageLabelDto', () => {
	describe('PickerItemDto', () => {
		it('should be able to construct a PickerItemDto object', async () => {
			const pickerItemDto = new PickerItemDto();
			expect(pickerItemDto).toEqual({});
		});
	});

	describe('ContentPageLabelDto', () => {
		it('should be able to construct a ContentPageLabelDto object', async () => {
			const contentPageLabelDto = new ContentPageLabelDto();
			expect(contentPageLabelDto).toEqual({});
		});
	});

});
