import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { Lookup_Languages_Enum } from '../../shared/generated/graphql-db-types-hetarchief';
import {
	Component,
	Locale,
	type TranslationKey,
	type TranslationLocation,
} from '../translations.types';

export class UpdateTranslationDto {
	@IsString()
	@ApiProperty({
		required: true,
		enum: Component,
		description:
			'The component in which this translation is used. Possible values: ' +
			Object.values(Component).join(', '),
		example: 'BACKEND',
	})
	component: Component;

	@IsString()
	@ApiProperty({
		required: true,
		type: String,
		description: 'The file location in which this translation occurs',
		example: 'modules/auth/controllers/het-archief',
	})
	location: TranslationLocation;

	@IsString()
	@ApiProperty({
		required: true,
		type: String,
		description:
			'The translation key that uniquely identifies the translation within the component and file',
		example: 'account-configuratie',
	})
	key: TranslationKey;

	@IsString()
	@ApiProperty({
		required: true,
		enum: Locale,
		description:
			'The language code of the current value. Possible values: ' +
			Object.values(Lookup_Languages_Enum).join(', '),
		example: 'EN',
	})
	languageCode: Locale;

	@IsString()
	@ApiProperty({
		required: true,
		description:
			'A key-value object where the key is the translation-key, and value is the translation itself',
		example: 'new translation value',
	})
	value: string;
}
