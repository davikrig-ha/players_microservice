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
      ackError.map(async (ackError) => {
        if (error.message.includes(ackError)) {
          await channel.ack(originalMsg);
        }
      });
    }
  }

  @MessagePattern('consult-categorie')
  async consultCategorie(@Payload() id: string) {
    if (id) {
      return await this.appService.consultOneCategorie(id);
    } else {
      return await this.appService.consultAllCategories();
    }
  }
}
