import {
	Checkbox,
	DatePicker,
	MultiRange,
	Select,
	TextArea,
	TextInput,
} from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import type { ContentBlockEditor } from '~modules/content-page/types/content-block.types';

import { ContentPicker } from '~shared/components/ContentPicker/ContentPicker';
import { ContentTypeAndLabelsPicker } from '~shared/components/ContentTypeAndLabelsPicker/ContentTypeAndLabelsPicker';
import FileUpload from '~shared/components/FileUpload/FileUpload';
import { IconPicker } from '~shared/components/IconPicker/IconPicker';
import { MaintainerSelect } from '~shared/components/MaintainerSelect/MaintainerSelect';
import RichTextEditorWithInternalStateWrapper from '~shared/components/RichTextEditorWithInternalStateWrapper/RichTextEditorWithInternalStateWrapper';
import { UploadOrSelectVideoStill } from '~shared/components/UploadOrSelectVideoStill/UploadOrSelectVideoStill';
import { UserGroupSelect } from '~shared/components/UserGroupSelect/UserGroupSelect';
import { AlignSelect, ColorSelect, PaddingSelect } from '../components/fields';

export const GET_EDITOR_TYPES_MAP = (): Record<ContentBlockEditor, FunctionComponent<any>> => ({
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
	RICH_TEXT_EDITOR: RichTextEditorWithInternalStateWrapper,
	MaintainerSelect,
	UploadOrSelectVideoStill,
});
