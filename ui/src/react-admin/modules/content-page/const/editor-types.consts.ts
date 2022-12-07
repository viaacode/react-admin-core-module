import {
	Checkbox,
	DatePicker,
	MultiRange,
	Select,
	TextArea,
	TextInput,
} from '@viaa/avo2-components';
import { FunctionComponent } from 'react';

import { ContentPicker } from '~modules/shared/components/ContentPicker/ContentPicker';
import { ContentTypeAndLabelsPicker } from '~modules/shared/components/ContentTypeAndLabelsPicker/ContentTypeAndLabelsPicker';
import FileUpload from '~modules/shared/components/FileUpload/FileUpload';
import { IconPicker } from '~modules/shared/components/IconPicker/IconPicker';
import RichTextEditorWrapper from '~modules/shared/components/RichTextEditorWrapper/RichTextEditorWrapper';
import { UserGroupSelect } from '~modules/shared/components/UserGroupSelect/UserGroupSelect';
import { AlignSelect, ColorSelect, PaddingSelect } from '../components/fields';

export const GET_EDITOR_TYPES_MAP = (): Record<string, FunctionComponent<any>> => ({
	AlignSelect,
	Checkbox,
	ColorSelect,
	ContentPicker,
	ContentTypeAndLabelsPicker,
	DatePicker,
	FileUpload,
	IconPicker,
	MultiRange,
	PaddingSelect,
	Select,
	TextArea,
	TextInput,
	UserGroupSelect,
	RICH_TEXT_EDITOR: RichTextEditorWrapper,
});
