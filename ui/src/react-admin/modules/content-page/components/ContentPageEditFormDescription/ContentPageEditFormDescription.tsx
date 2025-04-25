import { FormGroup } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { tText } from '~shared/helpers/translation-functions';

import { RICH_TEXT_EDITOR_OPTIONS_FULL } from '~modules/shared/consts/rich-text-editor.consts';
import { CONTENT_PAGE_DESCRIPTION_MAX_LENGTH_STRING } from '~modules/content-page/const/content-page.consts';
import { stripHtml } from '~shared/helpers/formatters/strip-html';
import RichTextEditorWithInternalStateWrapper from '~shared/components/RichTextEditorWithInternalStateWrapper/RichTextEditorWithInternalStateWrapper';

interface ContentPageEditFormDescriptionProps {
	value: string;
	onChange: (value: string) => void;
	formError: string | undefined;
	className?: string;
}

export const ContentPageEditFormDescription: FunctionComponent<
	ContentPageEditFormDescriptionProps
> = ({ value, onChange, formError, className }) => {
	const [description, setDescription] = useState(value || '');

	return (
		<FormGroup
			error={formError}
			label={
				tText(
					'modules/content-page/components/content-edit-form/content-edit-form___beschrijving',
					{
						maxLength: CONTENT_PAGE_DESCRIPTION_MAX_LENGTH_STRING,
					}
				) +
				` (${
					stripHtml(description)?.length || 0
				} / ${CONTENT_PAGE_DESCRIPTION_MAX_LENGTH_STRING})`
			}
			className={className}
		>
			<RichTextEditorWithInternalStateWrapper
				value={description}
				onChange={setDescription}
				onBlur={() => {
					onChange(description);
				}}
				controls={RICH_TEXT_EDITOR_OPTIONS_FULL}
				fileType="CONTENT_PAGE_DESCRIPTION_IMAGE"
				id="description"
			/>
		</FormGroup>
	);
};
