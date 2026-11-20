import { type CustomDecorator, SetMetadata } from '@nestjs/common';

export const RequireAllPermissions = (...requiredPermissions: string[]): CustomDecorator<string> =>
	SetMetadata('requiredPermissions', requiredPermissions);
