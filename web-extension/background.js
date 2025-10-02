import {io} from './lib/socket.io.esm.min.js';
import {SERVER_URL, socketClientOptions} from './constants.js';

const socket = io(SERVER_URL, socketClientOptions);

const connectToSocket = () => {
    console.log('Attempting to connect to server...');
    socket.connect();
}

const disconnectFromSocket = () => {
    if (socket.connected) {
        console.log('Disconnecting from server...');
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

socket.on('confirmation', (payload) => {

    console.log('Data reached the server!', payload);

})


// Connect when on Youtube video
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url?.includes("youtube.com/watch")) {
        connectToSocket();
    }
    else if (changeInfo.status === "complete" && !tab.url?.includes("youtube.com/watch")) {
        disconnectFromSocket();
    }
});

// Receive Login Confirmation
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




// setInterval(() => {
//
//     socket.emit('packet', {
//         caption: 'Hello, server! This is a periodic message from the client.',
//         timestamp: new Date().toISOString(),
//         videoUrl: 'google.com'
//     })
//
// }, 5000)