import mongoose from 'mongoose';

import possibleMoves from '../../../possible-moves';


const { Schema } = mongoose;

const round = new Schema({
  moves: [{ type: String, enum: Object.values(possibleMoves), required: true }],
  winner: { type: String, enum: Object.values(['left', 'right', 'none']), required: true },
}, {
  strict: 'throw',
});

export default round;
