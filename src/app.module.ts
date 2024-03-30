import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { ChargerModule } from './charger/charger.module';

@Module({
  imports: [UserModule, ChargerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
