import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private jogador: Jogador[] = [];

  private readonly logger = new Logger(JogadoresService.name);

  criarAtualizarJogador(criarJogadorDTO: CriarJogadorDTO): void {
    this.logger.log(`criarJogadorDTO: ${criarJogadorDTO}`);
    const { email } = criarJogadorDTO;

    const jogadorEncontrado = this.jogador.find((j) => j.email === email);

    if (jogadorEncontrado) {
      this.atualizar(jogadorEncontrado, criarJogadorDTO);
    } else {
      this.criar(criarJogadorDTO);
    }
  }

  consultarTodosJogadores(): Jogador[] {
    return this.jogador;
  }

  consultarJogadorEmail(email): Jogador {
    const jogadorEncontrado = this.jogador.find((j) => j.email === email);
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com o email: ${email} não existe.`);
    }
    return jogadorEncontrado;
  }

  deletarJogador(email): void {
    const jogadorEncontrado = this.jogador.find((j) => j.email === email);
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com o email: ${email} não existe.`);
    }
    this.jogador.filter((j) => j.email !== email);
  }

  private criar(criarJogadorDTO: CriarJogadorDTO): void {
    const { email, nome, telefone } = criarJogadorDTO;

    const jogador: Jogador = {
      _id: uuidv4(),
      nome,
      email,
      telefone,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'http://localhost/foto.jpg',
    };

    this.jogador.push(jogador);
  }

  private atualizar(
    jogadorEncontrado: Jogador,
    criarJogadorDTO: CriarJogadorDTO,
  ): void {
    const { nome } = criarJogadorDTO;
    jogadorEncontrado.nome = nome;
  }
}
