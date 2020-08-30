/*
  Nous utilisons Koa au lieu de Express comme framework/librairie pour gérer
  les requêtes entrantes.
  Koa a été créé par l'équipe derrière Express et fonctionne de manière très similaire.
  Si vous connaissez déjà Express, vous n'aurez aucun problème ici avec l'utilisation de Koa.
*/
import Koa from 'koa';
import requestsLogger from 'koa-logger';
/*
  Permet de gérer les CORS afin de permettre au front-end d'effectuer des requêtes
  vers le back-end.
 */
import cors from 'koa2-cors';

// Par cette seule ligne, nous rendons nos modèles accesibles partout dans l'application
// sans avoir à les importer manuellement.
import './Models';
import logger from '../logger';

// Router contenant la définiton de nos routes.
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
