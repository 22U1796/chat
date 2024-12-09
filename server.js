const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const users = {};

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("register", ({ username, password }, callback) => {
        if (users[username]) {
            callback({ success: false, message: "Username already exists." });
        } else {
            users[username] = password;
            callback({ success: true });
        }
    });

    socket.on("login", ({ username, password }, callback) => {
        if (users[username] && users[username] === password) {
            callback({ success: true });
        } else {
            callback({ success: false, message: "Invalid username or password." });
        }
    });

    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data);
    });

    socket.on("exit_user", (username) => {
        console.log(`${username} left the chat`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
server.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000`);
});
