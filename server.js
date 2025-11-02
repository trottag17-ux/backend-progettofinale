const express = require('express');
const passport = require("./config/passport");
const cors = require('cors');
const http = require("node:http");
require('dotenv').config();

const sessionMiddleware = require("./config/session");
const setupSocket = require("./config/socket");
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/autenticazione");
const db = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.set('trust proxy', 1);
app.use(cors({
    origin: process.env.CORS,
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

const io = setupSocket(server);

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/", authRoutes);
app.use("/", postRoutes);

app.get('/', (req, res) => res.send('Ciao dal backend'));

server.listen(port);