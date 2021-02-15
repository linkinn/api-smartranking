import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Get()
  consultarTodosJogadores(@Query('email') email: string): Jogador[] | Jogador {
    if (email) {
      return this.jogadoresService.consultarJogadorEmail(email);
    }
    return this.jogadoresService.consultarTodosJogadores();
  }

  @Post()
  criarAtualizarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    this.jogadoresService.criarAtualizarJogador(criarJogadorDTO);
  }

  @Delete()
  deletarJogador(@Query('email') email: string): void {
    this.jogadoresService.deletarJogador(email);
  }
}
