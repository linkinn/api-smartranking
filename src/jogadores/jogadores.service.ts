import { v4 as uuidv4 } from 'uuid';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarAtualizarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<void> {
    this.logger.log(`criarJogadorDTO: ${criarJogadorDTO}`);
    const { email } = criarJogadorDTO;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      this.atualizar(criarJogadorDTO);
    } else {
      this.criar(criarJogadorDTO);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com o email: ${email} não existe.`);
    }
    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<any> {
    return this.jogadorModel.remove({ email }).exec();
  }

  private async criar(criarJogadorDTO: CriarJogadorDTO): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criarJogadorDTO);
    return await jogadorCriado.save();
  }

  private async atualizar(criarJogadorDTO: CriarJogadorDTO): Promise<Jogador> {
    return await (
      await this.jogadorModel.findOneAndUpdate(
        { email: criarJogadorDTO.email },
        { $set: criarJogadorDTO },
      )
    ).execPopulate();
  }
}
