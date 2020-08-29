import { listen, close } from './App';
import connect from './connect';
import disconnect from './disconnect';
import logger from './logger';


connect(process.env.MONGODB_HOST, process.env.MONGODB_PORT, process.env.MONGODB_DB);
listen(process.env.PORT || 3001).catch((err) => { logger.fatal(err); process.exit(1); });

// Gracefull shutdown when receiving the SIGTERM signal.
process.on('SIGTERM', () => { close(() => { disconnect(() => { process.exit(0); }); }); });
