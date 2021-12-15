import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ValidationParametersPipe } from 'src/common/pipes/validate-parameters.pipe';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/players')
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    this.logger.log(`createPlayerDto: ${JSON.stringify(createPlayerDto)}`);

    const categorie = await this.clientAdminBackend
      .send('consult-categories', createPlayerDto.categorie)
      .toPromise();

    if (categorie) {
      await this.clientAdminBackend.emit('create-player', createPlayerDto);
    } else {
      throw new BadRequestException(`Category not registred!`);
    }
  }

  @Get()
  consultPlayer(@Query('idPlayer') id: string): Observable<any> {
    return this.clientAdminBackend.send('consult-players', id ? id : '');
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('id', ValidationParametersPipe) id: string,
  ) {
    const categorie = await this.clientAdminBackend
      .send('consult-categorie', updatePlayerDto.categorie)
      .toPromise();

    if (categorie) {
      await this.clientAdminBackend.emit('update-player', {
        id: id,
        player: updatePlayerDto,
      });
    } else {
      throw new BadRequestException(`Category not registred!`);
    }
  }

  @Delete('/:id')
  async deletePlayer(@Param('id', ValidationParametersPipe) id: string) {
    await this.clientAdminBackend.emit('delete-player', { id });
  }
}
