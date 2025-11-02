const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

db.once('open', () => console.log('Database connesso.'));

module.exports = db;