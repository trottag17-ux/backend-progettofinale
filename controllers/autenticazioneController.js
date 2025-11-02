const Utenti = require("../models/Utenti");
const passport = require("passport");

const authController = {
    register: (req, res) => {
        const { username, password } = req.body;
        const nuovoUtente = new Utenti({ username });

        Utenti.register(nuovoUtente, password, (err, user) => {
            if (err) {
                console.error(">>> ERRORE Utenti.register:", err);
                if (err.name === "UserExistsError") {
                    return res.status(409).json({ error: "Username già esistente" });
                }
                return res.status(400).json({ error: err.message });
            }

            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ error: "Login fallito dopo registrazione" });
                }

                return res.status(201).json({
                    message: `Benvenuto ${user.username}!`,
                    user: {
                        _id: user._id,
                        username: user.username,
                        ruolo: user.ruolo || "utente"
                    }
                });
            });
        });
    },

    login: (req, res, next) => {
        passport.authenticate("local", (err, user) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ error: "Credenziali non valide" });

            req.login(user, (err) => {
                if (err) return next(err);
                return res.status(200).json({
                    message: "Login effettuato con successo!",
                    user: {
                        _id: user._id,
                        username: user.username,
                        ruolo: user.ruolo || "utente"
                    }
                });
            });
        })(req, res, next);
    },

    logout: (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ error: "Errore durante il logout" });
            }
            res.status(200).json({ message: "Logout effettuato con successo" });
        });
    },

    me: (req, res) => {
        if (req.isAuthenticated()) {
            return res.status(200).json({
                user: {
                    _id: req.user._id,
                    username: req.user.username,
                    ruolo: req.user.ruolo || "utente"
                }
            });
        } else {
            return res.status(401).json({ error: "Non autenticato" });
        }
    }
};

module.exports = authController;