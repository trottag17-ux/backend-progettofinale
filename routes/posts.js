const express = require("express");
const router = express.Router();
const Post = require("../models/Posts");

router.post("/posts", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Utente non autenticato" });
    }

    const { descrizione, immagine } = req.body;

    const nuovoPost = new Post({
        descrizione,
        immagine,
        autore: req.user._id
    });

    nuovoPost.save()
        .then(post =>
            post.populate("autore", "username ruolo").then(populatedPost => {
                req.io.emit("nuovoPost", populatedPost);
                res.status(201).json(populatedPost);
            })
        )
        .catch(() => {
            res.status(500).json({ error: "Errore creazione post" });
        });
});

router.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("autore", "username ruolo")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch {
        res.status(500).json({ error: "Errore durante il recupero dei post" });
    }
});

router.put("/posts/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Utente non autenticato" });
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post non trovato" });

        if (!post.autore.equals(req.user._id)) {
            return res.status(403).json({ error: "Non sei l'autore del post" });
        }

        post.descrizione = req.body.descrizione;
        post.immagine = req.body.immagine;

        await post.save();
        const postAggiornato = await post.populate("autore", "username ruolo");
        req.io.emit("postModificato", postAggiornato);
        res.status(200).json(postAggiornato);
    } catch {
        res.status(500).json({ error: "Errore modifica post" });
    }
});

router.delete("/posts/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Utente non autenticato" });
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post non trovato" });

        const isAdmin = req.user.ruolo === "admin";
        const isAuthor = post.autore.equals(req.user._id);
        if (!isAdmin && !isAuthor) {
            return res.status(403).json({ error: "Non autorizzato a eliminare il post" });
        }

        await post.deleteOne();
        const postConAutore = await post.populate("autore", "username ruolo");

        req.io.emit("postEliminato", {
            _id: postConAutore._id,
            autore: postConAutore.autore,
            azioneDa: {
                _id: req.user._id,
                username: req.user.username,
                ruolo: req.user.ruolo
            }
        });

        res.status(200).json({ message: "Post eliminato con successo" });
    } catch {
        res.status(500).json({ error: "Errore durante l'eliminazione" });
    }
});

module.exports = router;