import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDTO, AtualizarJogadorDTO } from './dtos';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find();
  }

  async consultarJogadorId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findById(_id);

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com o email: ${_id} não existe.`);
    }

    return jogadorEncontrado;
  }

  async criarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<Jogador> {
    const { email } = criarJogadorDTO;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email });

    if (jogadorEncontrado) {
      throw new BadRequestException(
        `Jogador com e-mail ${email} ja cadastrado`,
      );
    }

    const jogadorCriado = new this.jogadorModel(criarJogadorDTO);
    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDTO: AtualizarJogadorDTO,
  ): Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findById(_id);

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: atualizarJogadorDTO })
      .exec();
  }

  async deletarJogador(_id: string): Promise<any> {
    const jogadorEncontrado = await this.jogadorModel.findById(_id);

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
    }

    this.jogadorModel.deleteOne({ _id }).exec();
  }
}
