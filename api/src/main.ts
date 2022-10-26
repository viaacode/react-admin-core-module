import { ConfigService as NestConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminCoreModule } from './admin-core.module';
import helmet from 'helmet';

import { ConfigService } from './config';

async function bootstrap() {
	const app = await NestFactory.create(AdminCoreModule);
	const configService = app.get<ConfigService>(NestConfigService);
	const port = configService.get('PORT') || 3300;

	/** Security */
	app.enableCors(configService.get('CORS_OPTIONS'));
	app.use(helmet());

	/** Swagger docs **/
	if (configService.get('ENVIRONMENT') !== 'production') {
		const swaggerConfig = new DocumentBuilder()
			.setTitle('Admin Core API docs')
			.setDescription('Documentatie voor de Admin Core api calls')
			.setVersion('0.1.0')
			.addCookieAuth('connect.sid')
			.build();
		const document = SwaggerModule.createDocument(app, swaggerConfig);
		SwaggerModule.setup('docs', app, document);
	}

	/** All good, start listening */
	await app.listen(port);
}

bootstrap();
