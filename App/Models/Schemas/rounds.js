import mongoose from 'mongoose';

import Round from './round';


const { Schema } = mongoose;

const rounds = new Schema({
  position: { type: Number, min: (-1), default: (-1) },
  rounds: [Round],
}, {
  strict: 'throw',
  versionKey: 'version',
  timestamps: {},
});

export default rounds;
