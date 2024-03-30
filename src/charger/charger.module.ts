import { Module } from '@nestjs/common';
import { ChargerController } from './charger.controller';

@Module({
  controllers: [ChargerController],
})
export class ChargerModule {}
