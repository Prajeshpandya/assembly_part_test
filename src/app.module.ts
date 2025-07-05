import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PartsModule } from './parts/parts.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-parts'),
    PartsModule,
  ],
})
export class AppModule {}
