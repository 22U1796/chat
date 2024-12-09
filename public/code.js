(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector("#go-to-register").addEventListener("click", function () {
        app.querySelector(".login-screen").classList.remove("active");
        app.querySelector(".register-screen").classList.add("active");
    });

    app.querySelector("#go-to-login").addEventListener("click", function () {
        app.querySelector(".register-screen").classList.remove("active");
        app.querySelector(".login-screen").classList.add("active");
    });

    app.querySelector("#register-user").addEventListener("click", function () {
        const username = app.querySelector("#register-username").value.trim();
        const password = app.querySelector("#register-password").value.trim();

        if (!username || !password) {
            alert("Please fill all fields.");
            return;
        }

        socket.emit("register", { username, password }, (response) => {
            if (response.success) {
                alert("Registration successful. Please log in.");
                app.querySelector(".register-screen").classList.remove("active");
                app.querySelector(".login-screen").classList.add("active");
            } else {
                alert(response.message);
            }
        });
    });

    app.querySelector("#login-user").addEventListener("click", function () {
        const username = app.querySelector("#login-username").value.trim();
        const password = app.querySelector("#login-password").value.trim();

        if (!username || !password) {
            alert("Please fill all fields.");
            return;
        }

        socket.emit("login", { username, password }, (response) => {
            if (response.success) {
                uname = username;
                app.querySelector(".login-screen").classList.remove("active");
                app.querySelector(".chat-screen").classList.add("active");
            } else {
                alert(response.message);
            }
        });
    });

    app.querySelector("#send-message").addEventListener("click", function () {
        const message = app.querySelector("#message-input").value.trim();

        if (!message) return;

        socket.emit("send_message", { username: uname, message });

        displayMessage("my-message", { name: "You", text: message });
        app.querySelector("#message-input").value = "";
    });

    socket.on("receive_message", (data) => {
        displayMessage("other-message", data);
    });

    app.querySelector("#exit-chat").addEventListener("click", function () {
        socket.emit("exit_user", uname);
        app.querySelector(".chat-screen").classList.remove("active");
        app.querySelector(".login-screen").classList.add("active");
    });

    function displayMessage(type, { name, text }) {
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message", type);

        const messageBox = document.createElement("div");
        messageBox.innerHTML = `<div class="name">${name}</div><div class="text">${text}</div>`;

        messageContainer.appendChild(messageBox);
        app.querySelector(".messages").appendChild(messageContainer);
        app.querySelector(".messages").scrollTop = app.querySelector(".messages").scrollHeight;
    }
})();
