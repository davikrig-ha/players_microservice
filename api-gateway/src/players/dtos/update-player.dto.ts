import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdatePlayerDto {
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  categorie: string;
}
