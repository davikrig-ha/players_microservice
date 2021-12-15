import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ClientProxySmartRanking } from './proxymq/client-proxy';
import { ProxyRMQModule } from './proxymq/proxyrmq.module';

@Module({
  imports: [CategoriesModule, PlayersModule, ProxyRMQModule],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule {}
