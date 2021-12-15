import { Controller, Get, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { Categorie } from './interfaces/categories/categorie.interface';

const ackError: string[] = ['E11000'];
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('create-categorie')
  async createCategorie(
    @Payload() categorie: Categorie,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(`categorie: ${JSON.stringify(categorie)}`);

    try {
      await this.appService.createCategorie(categorie);
      await channel.akc(originalMsg);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      const filterAckError = ackError.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('consult-categorie')
  async consultCategorie(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (id) {
        return await this.appService.consultOneCategorie(id);
      } else {
        return await this.appService.consultAllCategories();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-categorie')
  async updateCategorie(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`data: ${JSON.stringify(data)}`);
    try {
      const id: string = data.id;
      const categorie: Categorie = data.categories;
      await this.appService.updateCategorie(id, categorie);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackError.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }
}
