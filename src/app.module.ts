import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataModule } from './data/data.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/tech_assessment'),
    DataModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
