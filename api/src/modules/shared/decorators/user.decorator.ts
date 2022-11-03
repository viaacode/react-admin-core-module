import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { SessionUserEntity } from '../../users/classes/session-user';
import { SessionHelper } from '../auth/session-helper';

export const SessionUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): SessionUserEntity | null => {
		const request = ctx.switchToHttp().getRequest();
		return new SessionUserEntity(
			SessionHelper.getUserInfo(request.session),
		);
	},
);
