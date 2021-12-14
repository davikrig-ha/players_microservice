import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class CreateCategorieDto {
  @IsString()
  @IsNotEmpty()
  readonly categorie: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}

interface Event {
  name: string;
  operation: string;
  value: number;
}
