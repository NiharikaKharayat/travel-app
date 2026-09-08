// =================================================
// FERENE GROUP CHAT - CHATROOM.JS
// =================================================


// =================================================
// BACKEND CONFIGURATION
// =================================================

const BACKEND_URL = "http://127.0.0.1:8000";

const ROOM_ID = "travel-group";

const USERNAME =
    localStorage.getItem("ferene_username")
    || "Traveler";


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

console.log("Starting Socket.IO connection...");

console.log("Backend URL:", BACKEND_URL);


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
// INITIAL CONNECTION STATUS
// =================================================

connectionStatus.textContent =
    "Connecting...";

connectionStatus.style.color =
    "#64748b";


// =================================================
// SOCKET CONNECTED
// =================================================

socket.on(

    "connect",

    () => {

        console.log("=================================");
        console.log("SOCKET CONNECTED SUCCESSFULLY");
        console.log("Socket ID:", socket.id);
        console.log("=================================");


        connectionStatus.textContent =
            "Connected";

        connectionStatus.style.color =
            "#16a34a";


        // JOIN THE TRAVEL GROUP

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

    }

);


// =================================================
// SOCKET DISCONNECTED
// =================================================

socket.on(

    "disconnect",

    (reason) => {

        console.log(
            "Socket disconnected:",
            reason
        );


        connectionStatus.textContent =
            "Disconnected";

        connectionStatus.style.color =
            "#dc2626";

    }

);


// =================================================
// CONNECTION ERROR
// =================================================

socket.on(

    "connect_error",

    (error) => {

        console.error(
            "================================="
        );

        console.error(
            "SOCKET CONNECTION ERROR"
        );

        console.error(error);

        console.error(
            "================================="
        );


        connectionStatus.textContent =
            "Connection failed";

        connectionStatus.style.color =
            "#dc2626";

    }

);


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


        connectionStatus.textContent =
            "Reconnecting...";

        connectionStatus.style.color =
            "#f59e0b";

    }

);


// =================================================
// SYSTEM MESSAGE
// =================================================

socket.on(

    "system_message",

    (data) => {

        console.log(
            "System message received:",
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
// RECEIVE CHAT MESSAGE
// =================================================

socket.on(

    "receive_message",

    (data) => {

        console.log(
            "Chat message received:",
            data
        );


        if (

            data &&
            data.message

        ) {

            addChatMessage(

                data.username || "Traveler",

                data.message

            );

        }

    }

);


// =================================================
// SEND MESSAGE
// =================================================

function sendMessage() {

    console.log(
        "Send message button clicked"
    );


    const message =
        messageInput.value.trim();


    // CHECK EMPTY MESSAGE

    if (!message) {

        console.log(
            "Message is empty"
        );

        return;

    }


    // CHECK CONNECTION

    if (!socket.connected) {

        console.error(
            "Cannot send. Socket not connected."
        );


        connectionStatus.textContent =
            "Not connected";

        connectionStatus.style.color =
            "#dc2626";


        alert(
            "Chat server is not connected. Please check the connection."
        );

        return;

    }


    console.log(
        "Sending message:",
        message
    );


    // SEND MESSAGE TO SERVER

    socket.emit(

        "send_message",

        {

            room: ROOM_ID,

            username: USERNAME,

            message: message

        }

    );


    // CLEAR INPUT

    messageInput.value = "";


    // KEEP FOCUS

    messageInput.focus();

}


// =================================================
// ADD CHAT MESSAGE
// =================================================

function addChatMessage(

    username,

    message

) {


    const messageContainer =
        document.createElement("div");


    const isCurrentUser =
        username === USERNAME;


    if (isCurrentUser) {

        messageContainer.className =
            "flex justify-end mb-4";

    }

    else {

        messageContainer.className =
            "flex justify-start mb-4";

    }


    const messageBubble =
        document.createElement("div");


    if (isCurrentUser) {

        messageBubble.className =
            "max-w-[75%] bg-gradient-to-r from-gradient-start to-gradient-end text-white px-5 py-3 rounded-2xl rounded-br-sm shadow-sm";

    }

    else {

        messageBubble.className =
            "max-w-[75%] bg-surface-container-low text-on-surface px-5 py-3 rounded-2xl rounded-bl-sm shadow-sm";

    }


    // USERNAME

    const usernameElement =
        document.createElement("p");


    if (isCurrentUser) {

        usernameElement.className =
            "text-xs font-semibold opacity-80 mb-1";

        usernameElement.textContent =
            "You";

    }

    else {

        usernameElement.className =
            "text-xs font-semibold text-primary mb-1";

        usernameElement.textContent =
            username;

    }


    // MESSAGE TEXT

    const messageElement =
        document.createElement("p");


    messageElement.className =
        "text-sm break-words";


    messageElement.textContent =
        message;


    // ADD ELEMENTS

    messageBubble.appendChild(
        usernameElement
    );


    messageBubble.appendChild(
        messageElement
    );


    messageContainer.appendChild(
        messageBubble
    );


    chatMessages.appendChild(
        messageContainer
    );


    scrollToBottom();

}


// =================================================
// ADD SYSTEM MESSAGE
// =================================================

function addSystemMessage(message) {


    const container =
        document.createElement("div");


    container.className =
        "flex justify-center mb-4";


    const messageElement =
        document.createElement("div");


    messageElement.className =
        "bg-primary-container/10 text-text-muted px-4 py-2 rounded-full text-xs";


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

messageInput.addEventListener(

    "keydown",

    function(event) {


        if (

            event.key === "Enter"

        ) {


            event.preventDefault();


            sendMessage();

        }

    }

);


// =================================================
// SEND BUTTON EVENT LISTENER
// =================================================

sendButton.addEventListener(

    "click",

    function() {

        sendMessage();

    }

);


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
            "Socket object:",
            socket
        );


        messageInput.focus();

    }

);