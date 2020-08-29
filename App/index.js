import Koa from 'koa';
import requestsLogger from 'koa-logger';
import cors from 'koa2-cors';

import './Models';
import logger from '../logger';
import router from './Router';


let server = null;

export const app = new Koa();

app.use(requestsLogger());
app.use(cors({
  origin: (ctx) => {
    if (ctx.request.header.origin !== process.env.UI_URL) {
      return false;
    }
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(router.routes());
app.use(router.allowedMethods());

export const listen = async (port) => {
  server = app.listen(port, () => {
    logger.info(`The server is now listening on the port: ${port}
      and ready to accept incoming HTTP requests.`);
  });
};

export const close = (callback) => {
  if (server) {
    logger.info('The server will shutdown gracefully...');
    server.close(() => {
      logger.info('The server is no more listening for incoming requests (HTTP server closed).');
      if (callback) callback();
    });
  }
};

export default null;
