import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategorieSchema } from './interfaces/categories/categorie.schema';
import { PlayerSchema } from './interfaces/players/player.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://davi:170601da@cluster0.hocvo.mongodb.net/sradmbackend?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: 'Categorie', schema: CategorieSchema },
      { name: 'Player', schema: PlayerSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
