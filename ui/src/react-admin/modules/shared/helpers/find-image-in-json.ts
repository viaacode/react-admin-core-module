import { isString } from 'es-toolkit';
import { findValueDeep } from '~shared/helpers/find-value-deep';

const IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif', 'gif', 'bmp', 'tiff', 'tif', 'webp'];

// biome-ignore lint/suspicious/noExplicitAny: todo
export function findImageInJson(json: any): string | null {
	// biome-ignore lint/suspicious/noExplicitAny: todo
	return findValueDeep(json, (_: string | number, value: any) => {
		return (
			isString(value) &&
			value.startsWith('http') &&
			IMAGE_EXTENSIONS.some((extension) => value.includes(`.${extension}`))
		);
	});
}
