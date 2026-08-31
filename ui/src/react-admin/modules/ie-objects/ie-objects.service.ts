import { AdminConfigManager } from '~core/config';
import { CustomError } from '~shared/helpers/custom-error';
import { isHetArchief } from '~shared/helpers/is-hetarchief';

// NOTE (client route): ie-object detail pages live under this path on hetarchief.be. Adjust
// the prefix if the client application uses a different detail route for objects.
const OBJECT_DETAIL_PATH_PREFIX = '/pid';

export class IeObjectsService {
	/**
	 * Path of the detail page of an ie-object, relative to the client url.
	 * ie-objects only exist on hetarchief.be, so this throws on avo.
	 */
	public static getObjectDetailPathViaPid(schemaIdentifier: string): string {
		if (!isHetArchief()) {
			throw new CustomError('getObjectDetailPath is only available on hetarchief.be', null, {
				schemaIdentifier,
			});
		}
		return `${OBJECT_DETAIL_PATH_PREFIX}/${encodeURIComponent(schemaIdentifier)}`;
	}

	/**
	 * Path of the detail page of an ie-object, relative to the client url.
	 * ie-objects only exist on hetarchief.be, so this throws on avo.
	 */
	public static getObjectDetailPath(
		maintainerSlug: string,
		schemaIdentifier: string,
		objectName: string
	): string {
		if (!isHetArchief()) {
			throw new CustomError('getObjectDetailPath is only available on hetarchief.be', null, {
				schemaIdentifier,
			});
		}

		return (
			AdminConfigManager.getConfig().services.getIeObjectDetailPath?.(
				AdminConfigManager.getConfig().locale,
				maintainerSlug,
				schemaIdentifier,
				objectName
			) || IeObjectsService.getObjectDetailPathViaPid(schemaIdentifier)
		);
	}
}
