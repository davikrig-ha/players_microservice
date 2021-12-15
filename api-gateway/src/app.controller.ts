import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategorieDto } from './dtos/create-categorie.dto';

@Controller('api')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:bitnami@localhost:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  async createCategorie(@Body() createCategorieDto: CreateCategorieDto) {
    this.clientAdminBackend.emit('create-categorie', createCategorieDto);
  }

  @Get('categories')
  consultCategorie(@Query('idCategorie') id: string): Observable<any> {
    return this.clientAdminBackend.send('consult-categorie', id ? id : '');
  }
}
