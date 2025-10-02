import {io} from './lib/socket.io.esm.min.js';
import {SERVER_URL, socketClientOptions} from './constants.js';

const socket = io(SERVER_URL, socketClientOptions);

const connectToSocket = () => {
    console.log('Attempting to connect to server...');
    chrome.storage.local.get(["accessToken", "refreshToken"], (result) => {
        if (result) {
            socket.auth.accessToken = result.accessToken;
            socket.auth.refreshToken = result.refreshToken;
        }
    });
    socket.connect();
}

const disconnectFromSocket = () => {
    if (socket.connected) {
        console.log('Disconnecting from server...');
        socket.auth.accessToken = null;
        socket.auth.refreshToken = null;
        socket.disconnect();
    }
}

socket.on("connect", () => {
    console.log('Connected to server!', socket.id);
});

socket.on("connect_error", (error) => {
    console.error('Connection error:', error);
});

socket.on("disconnect", (reason) => {
    console.log('Disconnected:', reason);
});



// Connect when on Youtube video
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url?.includes("youtube.com/watch")) {
        connectToSocket();
    }
    else if (changeInfo.status === "complete" && !tab.url?.includes("youtube.com/watch")) {
        disconnectFromSocket();
    }
});

// Receive Login Confirmation and adding the tokens to the storage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "LOGIN_SUCCESS") {

        chrome.cookies.get(
            { url: SERVER_URL, name: "refreshToken" },
            (cookie) => {
                if (cookie) {
                    chrome.storage.local.set({ refreshToken: cookie.value });
                }
            }
        );

        chrome.cookies.get(
            { url: SERVER_URL, name: "accessToken" },
            (cookie) => {
                if (cookie) {
                    chrome.storage.local.set({ accessToken: cookie.value });
                }
            }
        );


        sendResponse({

            "statusCode": 200,
            "message": "Tokens stored successfully.",
            "success": true

        });
    }

    return true;
});

// TODO: First save the caption in storage and then send it to the server from there, instead of directly sending it to the server without storing

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "PACKET") {

        console.log('Received request to send data!!!!')
        socket.emit('packet', {
        caption: message.data?.caption,
        timestamp: new Date().toISOString(),
        videoUrl: 'google.com'
    });

        socket.on('confirmation', () => {

            sendResponse({
                "statusCode": 200,
                "message": "Data Emitted successfully!",
                "success": true
            })

        })


    }

})



// setInterval(() => {
//
//     socket.emit('packet', {
//         caption: 'Hello, server! This is a periodic message from the client.',
//         timestamp: new Date().toISOString(),
//         videoUrl: 'google.com'
//     })
//
// }, 5000)