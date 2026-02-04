import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import helmet from 'helmet';

import packageJson from '../package.json';

import { AdminCoreModule } from './admin-core.module';

async function bootstrap() {
	const app = await NestFactory.create(AdminCoreModule);
	const port = process.env.PORT || 3300;

	/** Security */
	app.enableCors({
		origin: (_origin: string, callback: (err: Error, allow: boolean) => void) => {
			// whitelist not enabled
			callback(null, true);
		},
		credentials: true,
		allowedHeaders: 'X-Requested-With, Content-Type, authorization, Origin, Accept, cache-control',
		methods: 'GET, POST, OPTIONS, PATCH, PUT, DELETE',
	});
	app.use(helmet());

	/** Increase POST json body size */
	app.use(json({ limit: '500kb' }));

	/** Swagger docs **/
	if (process.env.ENVIRONMENT !== 'production') {
		const swaggerConfig = new DocumentBuilder()
			.setTitle('Admin Core API docs')
			.setDescription('Documentatie voor de Admin Core api calls')
			.setVersion(packageJson.version)
			.addCookieAuth('connect.sid')
			.build();
		const document = SwaggerModule.createDocument(app, swaggerConfig);
		SwaggerModule.setup('docs', app, document);
	}

	/** All good, start listening */
	await app.listen(port);
}

bootstrap();
