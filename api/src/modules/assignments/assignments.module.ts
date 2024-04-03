import { forwardRef, Module } from '@nestjs/common';

import { DataModule } from '../data';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';

@Module({
	controllers: [AssignmentsController],
	imports: [forwardRef(() => DataModule)],
	providers: [AssignmentsService],
	exports: [AssignmentsService],
})
export class AssignmentsModule {}
