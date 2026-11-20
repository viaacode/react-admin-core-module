import { type CustomDecorator, SetMetadata } from '@nestjs/common';

export const RequireAnyPermissions = (
	...requireAnyPermissions: string[]
): CustomDecorator<string> => SetMetadata('requireAnyPermissions', requireAnyPermissions);
