import { ConfigService as NestConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { ConfigService } from './config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(NestConfigService);

	/** Swagger docs **/
	if (configService.get('environment') !== 'production') {
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
	await app.listen(3300);
}

bootstrap();
