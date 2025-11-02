const mongoose = require("mongoose");

const postSchema = new mongoose.Schema (
    {
        descrizione: {
            type: String,
            required: true
        },
        autore: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Utenti"
        },
        immagine: {
            type: String
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Post", postSchema);