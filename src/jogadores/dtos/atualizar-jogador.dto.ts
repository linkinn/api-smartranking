import { IsNotEmpty } from 'class-validator';

export class AtualizarJogadorDTO {
  @IsNotEmpty()
  readonly telefone: string;

  @IsNotEmpty()
  readonly nome: string;
}
