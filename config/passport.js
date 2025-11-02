const passport = require("passport");
const Utenti = require("../models/Utenti");

passport.use(Utenti.createStrategy());

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Utenti.findById(id).exec();
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;