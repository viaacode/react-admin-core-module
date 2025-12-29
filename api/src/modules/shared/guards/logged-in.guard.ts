import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import type { AvoUserHetArchiefUser, AvoUserUser } from '@viaa/avo2-types';
import type { Observable } from 'rxjs';
import { SessionHelper } from '../auth/session-helper';

@Injectable()
export class LoggedInGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = SessionHelper.getUserInfo(request);
		if (!(user as AvoUserHetArchiefUser)?.id && !(user as AvoUserUser)?.uid) {
			throw new UnauthorizedException('You must be logged in to use this endpoint');
		}
		return true;
	}
}
