import mongoose from 'mongoose';
import {
  it, describe, before, after,
} from 'mocha';
import should from 'should/as-function';
import request from 'supertest';

import { app } from '../App';
import connect from '../connect';
import disconnect from '../disconnect';
import possibleMoves from '../possible-moves';


const Rounds = mongoose.model('round');

before(() => {
  connect(process.env.MONGODB_HOST, process.env.MONGODB_PORT, process.env.MONGODB_DB);
});

after(() => {
  disconnect();
});

describe('POST /play', () => {
  before(async () => {
    await Rounds.deleteMany({});
  });

  after(async () => {
    await Rounds.deleteMany({});
  });

  let pos = 0;

  possibleMoves.map((move1, index1) => {
    possibleMoves.map((move2, index2) => {
      it(`If left move is ${move1} and right move is ${move2}`, async () => {
        const response = await request(app.listen())
          .post('/play')
          .send({
            moves: [move1, move2],
          });

        should(response.status).be.exactly(200);

        const { winner, position, moves } = response.body;

        if (index1 === index2) {
          should(winner).be.exactly('none');
        }

        if (index1 === 0 && index2 === possibleMoves.length - 1) {
          should(winner).be.exactly('left');
        }

        if (index2 === 0 && index1 === possibleMoves.length - 1) {
          should(winner).be.exactly('right');
        }

        if (
          index1 !== index2
            && !(index1 === 0 && index2 === possibleMoves.length - 1)
            && !(index2 === 0 && index1 === possibleMoves.length - 1)
        ) {
          if (index1 > index2) {
            should(winner).be.exactly('left');
          }

          if (index1 < index2) {
            should(winner).be.exactly('right');
          }
        }

        should(position).be.exactly(pos);
        should(moves).deepEqual([move1, move2]);

        const [tournament] = await Rounds.find({});

        should(tournament.position).be.exactly(pos);

        const lastRound = tournament.rounds[pos].toJSON();

        should(lastRound.winner).deepEqual(winner);
        should(lastRound.moves).deepEqual(moves);

        pos += 1;
      });

      return null;
    });

    return null;
  });
});

describe('GET /last', () => {
  before(async () => {
    await Rounds.deleteMany({});
  });

  after(async () => {
    await Rounds.deleteMany({});
  });

  it('If no rounds have ever been played, it should return the expected default values', async () => {
    const response = await request(app.listen()).get('/last');

    should(response.status).be.exactly(200);

    const { winner, position, moves } = response.body;

    should(winner).be.exactly('none');
    should(position).be.exactly((-1));
    should(moves).deepEqual([]);
  });

  it('It should return the last round correctly according to the current position', async () => {
    const moves1 = [
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
    ];

    const res1 = await request(app.listen()).post('/play').send({ moves: moves1 });

    const moves2 = [
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
    ];

    const res2 = await request(app.listen()).post('/play').send({ moves: moves2 });

    const moves3 = [
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
    ];

    await request(app.listen()).post('/play').send({ moves: moves3 });

    const res3 = await request(app.listen()).get('/last');

    should(res3.status).be.exactly(200);
    should(res3.body).containDeep(res2.body);
    should(res2.body).containDeep(res3.body);

    const res4 = await request(app.listen()).get('/last');

    should(res4.status).be.exactly(200);
    should(res4.body).containDeep(res1.body);
    should(res1.body).containDeep(res4.body);

    const res5 = await request(app.listen()).get('/last');

    should(res5.status).be.exactly(200);
    should(res5.body).containDeep({ winner: 'none', position: (-1), moves: [] });
  });
});


describe('GET /next', () => {
  before(async () => {
    await Rounds.deleteMany({});
  });

  after(async () => {
    await Rounds.deleteMany({});
  });

  it('If no rounds have ever been played, it should return the expected default values', async () => {
    const response = await request(app.listen()).get('/last');

    should(response.status).be.exactly(200);

    const { winner, position, moves } = response.body;

    should(winner).be.exactly('none');
    should(position).be.exactly((-1));
    should(moves).deepEqual([]);
  });

  it('It should return the next round correctly according to the current position', async () => {
    const moves1 = [
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
    ];

    await request(app.listen()).post('/play').send({ moves: moves1 });

    const moves2 = [
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
    ];

    const res1 = await request(app.listen()).post('/play').send({ moves: moves2 });

    const moves3 = [
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)],
    ];

    const res2 = await request(app.listen()).post('/play').send({ moves: moves3 });

    await request(app.listen()).get('/last');
    await request(app.listen()).get('/last');

    const res3 = await request(app.listen()).get('/next');

    should(res3.status).be.exactly(200);
    should(res3.body).containDeep(res1.body);
    should(res1.body).containDeep(res3.body);

    const res4 = await request(app.listen()).get('/next');

    should(res4.status).be.exactly(200);
    should(res4.body).containDeep(res2.body);
    should(res2.body).containDeep(res4.body);

    const res6 = await request(app.listen()).get('/next');

    should(res6.status).be.exactly(200);
    should(res6.body).containDeep({ winner: 'none', position: (-1), moves: [] });
  });
});

describe('DELETE /clear', () => {
  it('it should reinit the data in the database when called', async () => {
    const res = await request(app.listen()).delete('/clear');

    should(res.status).be.exactly(200);

    const { winner, moves, position } = res.body;

    should(winner).be.exactly('none');
    should(moves).deepEqual([]);
    should(position).be.exactly((-1));
  });
});
