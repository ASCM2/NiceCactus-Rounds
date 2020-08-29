import mongoose from 'mongoose';


function disconnect(callback) {
  mongoose.connection.close(() => { if (callback) callback(); });
}

export default disconnect;
