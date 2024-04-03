import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import { SessionUserEntity } from '../../users/classes/session-user';
import { SessionHelper } from '../auth/session-helper';

export const SessionUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): SessionUserEntity | null => {
		const request = ctx.switchToHttp().getRequest();
		const userInfoOnSession = SessionHelper.getUserInfo(request.session);
		return new SessionUserEntity(userInfoOnSession);
	}
);
