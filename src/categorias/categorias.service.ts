import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDTO } from './dtos';
import { CriarCategoriaDTO } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async consultarCategorias(): Promise<Array<Categoria>> {
    return await this.categoriaModel.find().populate('jogadores').exec();
  }

  async consultarCategoriaId(categoria: string): Promise<Categoria> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não encontrada!`);
    }

    return categoriaEncontrada;
  }

  async consultarCategoriaDoJogador(idJogador: any): Promise<Categoria> {
    /*
    Desafio
    Escopo da exceção realocado para o próprio Categorias Service
    Verificar se o jogador informado já se encontra cadastrado
    */

    //await this.jogadoresService.consultarJogadorPeloId(idJogador)

    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    const jogadorFilter = jogadores.filter(
      (jogador) => jogador._id == idJogador,
    );

    if (jogadorFilter.length == 0) {
      throw new BadRequestException(`O id ${idJogador} não é um jogador!`);
    }

    return await this.categoriaModel
      .findOne()
      .where('jogadores')
      .in(idJogador)
      .exec();
  }

  async criarCategoria(
    criarCategoriaDTO: CriarCategoriaDTO,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDTO;

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaEncontrada) {
      throw new BadRequestException(`Categoria ${categoria} já cadastrada!`);
    }

    const categoriaCriada = new this.categoriaModel(criarCategoriaDTO);
    return await categoriaCriada.save();
  }

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (!categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não cadastrada!`);
    }

    await this.jogadoresService.consultarJogadorId(idJogador);

    const jogadorJaCadastradoCategoria = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();

    if (jogadorJaCadastradoCategoria.length > 0) {
      throw new BadRequestException(
        `Jogador ${idJogador} já cadastrado na categoria!`,
      );
    }

    categoriaEncontrada.jogadores.push(idJogador);
    await this.categoriaModel.findOneAndUpdate(
      { categoria },
      { $set: categoriaEncontrada },
    );
  }

  async atualizarCategoria(
    categoria: string,
    atualizarCategoriaDTO: AtualizarCategoriaDTO,
  ): Promise<void> {
    const categoriaEncontrada = await this.categoriaModel
      .findOne({ categoria })
      .exec();

    if (categoriaEncontrada) {
      throw new NotFoundException(`Categoria ${categoria} não cadastrada!`);
    }

    await this.categoriaModel
      .findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDTO })
      .exec();
  }
}
