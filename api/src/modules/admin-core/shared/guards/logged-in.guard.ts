import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { Configuration } from '../../../../config';

import { SessionHelper } from '../auth/session-helper';

@Injectable()
export class LoggedInGuard implements CanActivate {
	constructor(private configService: ConfigService<Configuration>) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		if (this.configService.get('IS_ADMIN_CORE_DEMO_APP')) {
			return true; // There is no authentication in the admin core test app
		}

		const request = context.switchToHttp().getRequest();
		const user = SessionHelper.getArchiefUserInfo(request.session);
		if (!user?.id) {
			throw new UnauthorizedException(
				'You must be logged in to use this endpoint',
			);
		}
		return true;
	}
}
