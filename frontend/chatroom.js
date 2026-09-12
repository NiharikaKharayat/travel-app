// =================================================
// FERENE GROUP CHAT - CHATROOM.JS
// =================================================


// =================================================
// BACKEND CONFIGURATION
// =================================================

const BACKEND_URL = "http://127.0.0.1:8000";

const ROOM_ID = "travel-group";

const USERNAME =
    localStorage.getItem("ferene_username") || "Traveler";


// =================================================
// HTML ELEMENTS
// =================================================

const chatMessages =
    document.getElementById("chatMessages");

const messageInput =
    document.getElementById("messageInput");

const connectionStatus =
    document.getElementById("connectionStatus");

const sendButton =
    document.getElementById("sendButton");


// =================================================
// SOCKET CONNECTION
// =================================================

console.log("=================================");
console.log("FERENE CHATROOM");
console.log("Starting Socket.IO connection...");
console.log("Backend URL:", BACKEND_URL);
console.log("Username:", USERNAME);
console.log("Room:", ROOM_ID);
console.log("=================================");


const socket = io(
    BACKEND_URL,
    {
        path: "/socket.io",

        transports: [
            "polling",
            "websocket"
        ],

        timeout: 10000,

        reconnection: true,

        reconnectionAttempts: 10,

        reconnectionDelay: 1000,

        forceNew: true
    }
);


// =================================================
// INITIAL STATUS
// =================================================

if (connectionStatus) {

    connectionStatus.textContent =
        "Connecting...";

    connectionStatus.style.color =
        "#64748b";
}


// =================================================
// SOCKET CONNECTED
// =================================================

socket.on("connect", () => {

    console.log("=================================");
    console.log("SOCKET CONNECTED");
    console.log("MY SOCKET ID:", socket.id);
    console.log("USERNAME:", USERNAME);
    console.log("=================================");


    if (connectionStatus) {

        connectionStatus.textContent =
            "Connected";

        connectionStatus.style.color =
            "#16a34a";
    }


    // =================================================
    // JOIN ROOM
    // =================================================

    socket.emit(
        "join_room",
        {
            room: ROOM_ID,
            username: USERNAME
        },
        (response) => {

            console.log(
                "Join room response:",
                response
            );

        }
    );

});


// =================================================
// SOCKET DISCONNECTED
// =================================================

socket.on("disconnect", (reason) => {

    console.log(
        "Socket disconnected:",
        reason
    );


    if (connectionStatus) {

        connectionStatus.textContent =
            "Disconnected";

        connectionStatus.style.color =
            "#dc2626";
    }

});


// =================================================
// CONNECTION ERROR
// =================================================

socket.on("connect_error", (error) => {

    console.error(
        "Socket connection error:",
        error
    );


    if (connectionStatus) {

        connectionStatus.textContent =
            "Connection failed";

        connectionStatus.style.color =
            "#dc2626";
    }

});


// =================================================
// RECONNECTING
// =================================================

socket.on(
    "reconnect_attempt",
    (attemptNumber) => {

        console.log(
            "Reconnecting... Attempt:",
            attemptNumber
        );


        if (connectionStatus) {

            connectionStatus.textContent =
                "Reconnecting...";

            connectionStatus.style.color =
                "#f59e0b";
        }

    }
);


// =================================================
// SYSTEM MESSAGE
// =================================================

socket.on(
    "system_message",
    (data) => {

        console.log(
            "System message:",
            data
        );


        if (
            data &&
            data.message
        ) {

            addSystemMessage(
                data.message
            );

        }

    }
);


// =================================================
// CHAT HISTORY (SENT ONLY TO THE JOINING SOCKET)
// =================================================
//
// This is a one-time event received right after
// join_room. It is handled separately from
// "receive_message" so history is never mistaken
// for a brand-new live message.
// =================================================

socket.on(
    "chat_history",
    (data) => {

        console.log(
            "Chat history received:",
            data
        );

        if (
            !data ||
            !Array.isArray(data.messages)
        ) {
            return;
        }

        data.messages.forEach((entry) => {

            if (
                entry &&
                entry.message
            ) {

                addChatMessage(
                    entry.username || "Traveler",
                    entry.message,
                    entry.sender_id
                );

            }

        });

    }
);


// =================================================
// RECEIVE CHAT MESSAGE
// =================================================

socket.on(
    "receive_message",
    (data) => {

        console.log("=================================");
        console.log("CHAT MESSAGE RECEIVED");
        console.log("MY SOCKET ID:", socket.id);
        console.log("MESSAGE SENDER ID:", data?.sender_id);
        console.log("=================================");


        if (
            data &&
            data.message
        ) {

            addChatMessage(
                data.username || "Traveler",
                data.message,
                data.sender_id
            );

        }

    }
);


// =================================================
// SEND MESSAGE
// =================================================

function sendMessage() {

    if (!messageInput) {

        console.error(
            "Message input not found."
        );

        return;
    }


    const message =
        messageInput.value.trim();


    // =================================================
    // EMPTY MESSAGE
    // =================================================

    if (!message) {
        return;
    }


    // =================================================
    // CHECK CONNECTION
    // =================================================

    if (!socket.connected) {

        if (connectionStatus) {

            connectionStatus.textContent =
                "Not connected";

            connectionStatus.style.color =
                "#dc2626";
        }


        alert(
            "Chat server is not connected. Please check the connection."
        );


        return;
    }


    // =================================================
    // SEND MESSAGE
    // =================================================
    //
    // NOTE: We do NOT locally append this message to the
    // chat UI here. The server broadcasts it back to
    // everyone in the room, including us, via
    // "receive_message". Appending it locally as well
    // would create a duplicate.
    // =================================================

    socket.emit(
        "send_message",
        {
            room: ROOM_ID,
            username: USERNAME,
            message: message
        }
    );


    // =================================================
    // CLEAR INPUT
    // =================================================

    messageInput.value = "";

    messageInput.focus();

}


// =================================================
// ADD CHAT MESSAGE
// =================================================

function addChatMessage(
    username,
    message,
    senderId
) {

    if (!chatMessages) {

        console.error(
            "chatMessages element not found."
        );

        return;
    }


    // =================================================
    // DETERMINE MESSAGE TYPE
    // =================================================
    //
    // IMPORTANT:
    //
    // We NEVER use the username to decide left/right,
    // since two users can share the same username.
    //
    // Instead we compare the real Socket.IO sender_id
    // of the message against our OWN current socket.id.
    //
    // sender_id === socket.id
    //     → THIS IS MY MESSAGE
    //     → RIGHT SIDE
    //
    // sender_id !== socket.id
    //     → SOMEONE ELSE'S MESSAGE
    //     → LEFT SIDE
    //
    // =================================================

    const isCurrentUser =
        String(senderId || "").trim() ===
        String(socket.id || "").trim();


    console.log("IS MY MESSAGE:", isCurrentUser);


    // =================================================
    // MESSAGE ROW
    // =================================================

    const messageContainer =
        document.createElement("div");


    // Explicit class
    messageContainer.classList.add(
        "chat-message-row"
    );


    if (isCurrentUser) {

        messageContainer.classList.add(
            "sent"
        );

    } else {

        messageContainer.classList.add(
            "received"
        );

    }


    // =================================================
    // MESSAGE BUBBLE
    // =================================================

    const messageBubble =
        document.createElement("div");


    messageBubble.classList.add(
        "chat-bubble"
    );


    // =================================================
    // USERNAME
    // =================================================

    const usernameElement =
        document.createElement("p");


    usernameElement.classList.add(
        "chat-sender-name"
    );


    if (isCurrentUser) {

        usernameElement.textContent =
            "You";

    } else {

        usernameElement.textContent =
            username || "Traveler";

    }


    // =================================================
    // MESSAGE TEXT
    // =================================================

    const messageElement =
        document.createElement("p");


    messageElement.classList.add(
        "chat-message-text"
    );


    messageElement.textContent =
        message;


    // =================================================
    // BUILD MESSAGE BUBBLE
    // =================================================

    messageBubble.appendChild(
        usernameElement
    );


    messageBubble.appendChild(
        messageElement
    );


    // =================================================
    // ADD BUBBLE TO ROW
    // =================================================

    messageContainer.appendChild(
        messageBubble
    );


    // =================================================
    // ADD ROW TO CHAT
    // =================================================

    chatMessages.appendChild(
        messageContainer
    );


    // =================================================
    // SCROLL TO BOTTOM
    // =================================================

    scrollToBottom();

}


// =================================================
// ADD SYSTEM MESSAGE
// =================================================

function addSystemMessage(message) {

    if (!chatMessages) {
        return;
    }


    const container =
        document.createElement("div");


    container.classList.add(
        "chat-system-message"
    );


    const messageElement =
        document.createElement("span");


    messageElement.textContent =
        message;


    container.appendChild(
        messageElement
    );


    chatMessages.appendChild(
        container
    );


    scrollToBottom();

}


// =================================================
// SCROLL TO BOTTOM
// =================================================

function scrollToBottom() {

    if (!chatMessages) {
        return;
    }


    setTimeout(
        () => {

            chatMessages.scrollTop =
                chatMessages.scrollHeight;

        },
        50
    );

}


// =================================================
// ENTER KEY
// =================================================

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


// =================================================
// SEND BUTTON
// =================================================

if (sendButton) {

    sendButton.addEventListener(
        "click",
        () => {

            sendMessage();

        }
    );

}


// =================================================
// PAGE LOADED
// =================================================

window.addEventListener(
    "load",
    () => {

        console.log(
            "Chatroom page loaded"
        );

        console.log(
            "Current Socket ID:",
            socket.id
        );


        if (messageInput) {

            messageInput.focus();

        }

    }
);