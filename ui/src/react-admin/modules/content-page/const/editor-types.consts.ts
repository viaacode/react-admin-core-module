import {
	Checkbox,
	DatePicker,
	MultiRange,
	Select,
	TextArea,
	TextInput,
} from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import { AlignSelect } from '~modules/content-page/components/fields/AlignSelect/AlignSelect.js';
import { ColorSelect } from '~modules/content-page/components/fields/ColorSelect/ColorSelect.js';
import { PaddingSelectSingleValue } from '~modules/content-page/components/fields/PaddingSelectSingleValue/PaddingSelectSingleValue.js';
import { PaddingSelectTopBottom } from '~modules/content-page/components/fields/PaddingSelectTopBottom/PaddingSelectTopBottom.js';
import type { ContentBlockEditor } from '~modules/content-page/types/content-block.types.js';
import { ContentPicker } from '~shared/components/ContentPicker/ContentPicker.js';
import { ContentTypeAndLabelsPicker } from '~shared/components/ContentTypeAndLabelsPicker/ContentTypeAndLabelsPicker.js';
import FileUpload from '~shared/components/FileUpload/FileUpload.js';
import { IconPicker } from '~shared/components/IconPicker/IconPicker.js';
import { MaintainerSelect } from '~shared/components/MaintainerSelect/MaintainerSelect.js';
import RichTextEditorWithInternalStateWrapper from '~shared/components/RichTextEditorWithInternalStateWrapper/RichTextEditorWithInternalStateWrapper.js';
import { UploadOrSelectVideoStill } from '~shared/components/UploadOrSelectVideoStill/UploadOrSelectVideoStill.js';
import { UserGroupSelect } from '~shared/components/UserGroupSelect/UserGroupSelect.js';

export const GET_EDITOR_TYPES_MAP = (): Record<
	ContentBlockEditor,
	// biome-ignore lint/suspicious/noExplicitAny: todo
	FunctionComponent<any>
> => ({
	AlignSelect,
	Checkbox,
	ColorSelect,
	ContentPicker,
	ContentTypeAndLabelsPicker,
	DatePicker,
	FileUpload,
	IconPicker,
	MultiRange,
	PaddingSelect: PaddingSelectTopBottom, // We cannot rename this to PaddingSelectTopBottom because the "PaddingSelect" value is already stored in various blocks in the database
	PaddingSelectSingleValue,
	Select,
	TextArea,
	TextInput,
	UserGroupSelect,
	RICH_TEXT_EDITOR: RichTextEditorWithInternalStateWrapper,
	MaintainerSelect,
	UploadOrSelectVideoStill,
});
