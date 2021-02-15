import * as mongosse from 'mongoose';

export const JogadorSchema = new mongosse.Schema(
  {
    email: { type: String, unique: true },
    telefone: { type: String },
    nome: String,
    ranking: String,
    posicaoRanking: Number,
    urlFotoJogador: String,
  },
  { timestamps: true, collection: 'jogadores' },
);
