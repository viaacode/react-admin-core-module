import { forwardRef, Module } from '@nestjs/common';
import { DataModule } from '../admin-core/data/data.module';
import { StatusController } from './controllers/status.controller';
import { StatusService } from './services/status.service';

@Module({
	controllers: [StatusController],
	imports: [forwardRef(() => DataModule)],
	providers: [StatusService],
	exports: [StatusService],
})
export class StatusModule {}
