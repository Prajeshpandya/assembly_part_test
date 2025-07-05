import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartsController } from './parts.controller';
import { PartsService } from './parts.service';
import { Part, PartSchema } from './schema/part.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Part.name, schema: PartSchema }])],
  controllers: [PartsController],
  providers: [PartsService],
})
export class PartsModule {}
