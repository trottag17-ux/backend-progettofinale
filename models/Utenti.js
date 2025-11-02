const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const utenteSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    ruolo: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

utenteSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Utenti', utenteSchema);