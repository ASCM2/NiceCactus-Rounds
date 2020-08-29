import mongoose from 'mongoose';
import Router from 'koa-router';
import bodyParser from 'koa-body';

import { winner as computeWinner } from '../../possible-moves';


const returnError = (ctx, err) => {
  ctx.status = 500;
  ctx.body = { message: `An error occured in the end middleware: ${err.message}` };
};

const Rounds = mongoose.model('round');

const last = async (ctx) => {
  try {
    const saved = await Rounds.find({});

    let lastRound = { winner: 'none', moves: [] };
    let lastPosition = (-1);

    if (saved.length > 0) {
      const [tournament] = saved;

      if (tournament.position > 0) {
        lastPosition = tournament.position - 1;
        tournament.position = lastPosition;
        const { _id: id, ...rest } = tournament.rounds[lastPosition].toJSON();

        lastRound = { ...rest };
        await tournament.save();
      }
    }

    ctx.status = 200;
    ctx.body = { ...lastRound, position: lastPosition };
  } catch (err) {
    returnError(ctx, err);
  }
};

const next = async (ctx) => {
  try {
    const saved = await Rounds.find({});

    let nextRound = { winner: 'none', moves: [] };
    let nextPosition = (-1);

    if (saved.length > 0) {
      const [tournament] = saved;

      if (tournament.position < tournament.rounds.length - 1) {
        nextPosition = tournament.position + 1;
        tournament.position = nextPosition;
        const { _id: id, ...rest } = tournament.rounds[nextPosition].toJSON();

        nextRound = { ...rest };
        await tournament.save();
      }
    }

    ctx.status = 200;
    ctx.body = { ...nextRound, position: nextPosition };
  } catch (err) {
    returnError(ctx, err);
  }
};

const play = async (ctx) => {
  try {
    const { moves } = ctx.request.body;
    const winner = computeWinner(moves);
    const saved = await Rounds.find({});
    let newPosition = 0;

    if (saved.length === 0) {
      await new Rounds({ position: newPosition, rounds: [{ moves, winner }] }).save();
    } else {
      const [tournament] = saved;

      tournament.rounds.push({ moves, winner });
      tournament.position = tournament.rounds.length - 1;
      newPosition = tournament.position;
      await tournament.save();
    }

    ctx.status = 200;
    ctx.body = { winner, position: newPosition, moves };
  } catch (err) {
    returnError(ctx, err);
  }
};

const clear = async (ctx) => {
  try {
    const saved = await Rounds.find({});

    if (saved.length > 0) {
      const [tournament] = saved;

      tournament.rounds = [];
      tournament.position = (-1);

      await tournament.save();
    }

    ctx.status = 200;
    ctx.body = { winner: 'none', moves: [], position: (-1) };
  } catch (err) {
    console.log(err);
    returnError(ctx, err);
  }
};

const router = new Router();

router.get('/last', last);
router.get('/next', next);
router.post('/play', bodyParser(), play);
router.delete('/clear', clear);

export default router;
