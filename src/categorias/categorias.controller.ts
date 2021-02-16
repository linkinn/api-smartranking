import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDTO, CriarCategoriaDTO } from './dtos';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriaService: CategoriasService) {}

  @Get()
  async consultarCategorias(): Promise<Array<Categoria>> {
    return await this.categoriaService.consultarCategorias();
  }

  @Get('/:categoria')
  async consultarCategoriaId(
    @Param('categoria') categoria: string,
  ): Promise<Categoria> {
    return await this.categoriaService.consultarCategoriaId(categoria);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDTO: CriarCategoriaDTO,
  ): Promise<Categoria> {
    return await this.categoriaService.criarCategoria(criarCategoriaDTO);
  }

  @Post('/:categoria/jogador/:idJogador')
  async atribuirCategoriaJogador(@Param() params: string[]): Promise<void> {
    return await this.categoriaService.atribuirCategoriaJogador(params);
  }

  @Put('/:categoria')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDTO: AtualizarCategoriaDTO,
    @Param('categoria') categoria: string,
  ): Promise<void> {
    await this.categoriaService.atualizarCategoria(
      categoria,
      atualizarCategoriaDTO,
    );
  }
}
