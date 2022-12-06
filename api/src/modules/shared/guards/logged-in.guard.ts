import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import type { Avo } from '@viaa/avo2-types';
import { Observable } from 'rxjs';
import { HetArchiefUser } from '../../users/users.types';

import { SessionHelper } from '../auth/session-helper';

@Injectable()
export class LoggedInGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = SessionHelper.getUserInfo(request.session);
		if (!(user as HetArchiefUser)?.id && !(user as Avo.User.User)?.uid) {
			throw new UnauthorizedException(
				'You must be logged in to use this endpoint',
			);
		}
		return true;
	}
}
