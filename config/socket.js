const { Server } = require("socket.io");

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS,
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.auth?.token;
        if (!userId) return socket.disconnect();
    });

    return io;
}

module.exports = setupSocket;