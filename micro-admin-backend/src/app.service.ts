import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Categorie } from './interfaces/categories/categorie.interface';
import { Player } from './interfaces/players/player.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Categorie') private readonly categorieModel: Model<Categorie>,
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(AppService.name);

  async createCategorie(categorie: Categorie): Promise<Categorie> {
    try {
      const createdCategorie = new this.categorieModel(categorie);
      return await createdCategorie.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
    }
  }

  async consultAllCategories(): Promise<Categorie[]> {
    try {
      return await this.categorieModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultOneCategorie(id: string): Promise<Categorie> {
    try {
      return await this.categorieModel.findOne({ id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
