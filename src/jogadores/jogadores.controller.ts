import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarJogadorDTO, AtualizarJogadorDTO } from './dtos';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametroPipe } from '../common/pipes/validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {
    return await this.jogadoresService.consultarTodosJogadores();
  }

  @Get('/:_id')
  async consultarJogador(
    @Param('_id', ValidacaoParametroPipe) _id: string,
  ): Promise<Jogador> {
    return await this.jogadoresService.consultarJogadorId(_id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() criarJogadorDTO: CriarJogadorDTO,
  ): Promise<Jogador> {
    return await this.jogadoresService.criarJogador(criarJogadorDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDTO: AtualizarJogadorDTO,
    @Param('_id', ValidacaoParametroPipe) _id: string,
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(_id, atualizarJogadorDTO);
  }

  @Delete('/:_id')
  async deletarJogador(
    @Param('_id', ValidacaoParametroPipe) _id: string,
  ): Promise<void> {
    await this.jogadoresService.deletarJogador(_id);
  }
}
