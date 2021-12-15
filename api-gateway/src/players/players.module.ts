import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxymq/proxyrmq.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [ProxyRMQModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
