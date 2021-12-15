import {
  Controller,
  Get,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Query,
  Put,
  Param,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy';
import { CreateCategorieDto } from './dtos/create-categorie.dto';
import { UpdateCategorieDto } from './dtos/update-categorie.dto';

@Controller('api/categories')
export class CategoriesController {
  private logger = new Logger(CategoriesController.name);

  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  createCategorie(@Body() createCategorieDto: CreateCategorieDto) {
    this.clientAdminBackend.emit('create-categorie', createCategorieDto);
  }

  @Get()
  consultCategories(@Query('idCategorie') id: string): Observable<any> {
    return this.clientAdminBackend.send('consult-categories', id ? id : '');
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updateCategorie(
    @Body() updateCategorieDto: UpdateCategorieDto,
    @Param('id') id: string,
  ) {
    this.clientAdminBackend.emit('update-categorie', {
      id: id,
      categorie: updateCategorieDto,
    });
  }
}
