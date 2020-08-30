/*
  Listen et close permettent respectivement de démarrer le serveur HTTP et de le fermer.
*/
import { listen, close } from './App';
import connect from './connect';
import disconnect from './disconnect';

/*
  Rediriger les logs vers stdout avec un niveau de hiérachisation des logs
*/
import logger from './logger';


/* Fonction permettant de lancer la connection à la base de données MongoDB */
connect(process.env.MONGODB_HOST, process.env.MONGODB_PORT, process.env.MONGODB_DB);
/*
  Nous n'avons pas besoin d'attendre que la connexion à la base de données MongoDB
  ait été initialisée avant d'ouvrir le serveur HTTP et d'accepter des requêtes
  entrantes.
  Si la connexion à la base de données n'est pas encore effectuée, Mongoose enregistrera
  les requêtes effectuées et les exécutera une fois que la connexion aura été effectuée.
*/
listen(process.env.PORT || 3001).catch((err) => { logger.fatal(err); process.exit(1); });

// Nous pouvons donner l'ordre à notre microservice de s'arrêter gracieusement sans que cela
// entraîne des pertes de donnée en base de données ou d'autres dommanges indésirables.
/* la fonction disconnect permet de se déconnecter de la base de données gracieusement. */
/*
  Bien évidemmment on bloque les requêtes entrantes avant ensuite de se déconnecter
  de la base de données.
*/
process.on('SIGTERM', () => { close(() => { disconnect(() => { process.exit(0); }); }); });
