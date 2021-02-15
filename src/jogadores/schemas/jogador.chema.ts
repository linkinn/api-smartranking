import * as mongosse from 'mongoose';

export const JogadorSchema = new mongosse.Schema(
  {
    telefone: { type: String, unique: true },
    email: { type: String, unique: true },
    nome: String,
    ranking: String,
    posicaoRanking: Number,
    urlFotoJogador: String,
  },
  { timestamps: true, collection: 'jogadores' },
);
