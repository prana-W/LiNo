import {connectToSocket, disconnectFromSocket} from "./socket/socket.js";
import {handlePacket, handleSuccessfulLogin} from "./controllers/messageHandler.controller.js";

// Connect when on YouTube video
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url?.includes("youtube.com/watch")) {
        connectToSocket();
    } else if (changeInfo.status === "complete" && !tab.url?.includes("youtube.com/watch")) {
        disconnectFromSocket();
    }
});

// TODO: First save the caption in storage and then send it to the server from there, instead of directly sending it to the server without storing

// Receive Login Confirmation and adding the tokens to the storage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    switch (message.type) {
        case "LOGIN_SUCCESS":
            handleSuccessfulLogin();
            break;

        case "PACKET":
            handlePacket();
            break;

    }

    return true;

});