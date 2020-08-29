import mongoose from 'mongoose';


function connect(host, port, db, callback) {
  mongoose.set('useNewUrlParser', true);
  mongoose.connect(`mongodb://${host}:${port}/${db}`, (err) => {
    if (err) {
      if (callback) {
        callback(err);
      } else {
        process.exit(1);
      }
      return;
    }

    if (callback) callback();
  });
}

export default connect;
