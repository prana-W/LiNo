import {connectToSocket, disconnectFromSocket} from "./socket/socket.js";
import {
    handlePacket,
    handleSuccessfulLogin,
    handleScreenshot,
    handleTextSend
} from "./controllers/messageHandler.controller.js";

// Connect to socket when on YouTube video
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url?.includes("youtube.com/watch")) {
        connectToSocket();
    } else if (changeInfo.status === "complete" && !tab.url?.includes("youtube.com/watch")) {
        disconnectFromSocket();
    }
});

// Receive Login Confirmation and adding the tokens to the storage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    switch (message.type) {
        case "LOGIN_SUCCESS":
            handleSuccessfulLogin(message, sender, sendResponse);
            break;
        //
        // case "PACKET":
        //     handlePacket(message, sender, sendResponse);
        //     break;

        case "SCREENSHOT_CAPTURE_TAB":
            handleScreenshot(message, sender, sendResponse);
            break;

            case "TEXT_SEND_TAB":
             handleTextSend(message, sender, sendResponse);
             break;
    }

    return true;

});