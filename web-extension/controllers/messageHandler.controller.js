import {socket} from "../socket/socket.js";
import {SERVER_URL} from "../constants";

const handleSuccessfulLogin = () => {
    console.log('User logged in to LiNo');
    return (message, sender, sendResponse) => {

        chrome.cookies.get(
            {url: SERVER_URL, name: "refreshToken"},
            (cookie) => {
                if (cookie) {
                    chrome.storage.local.set({refreshToken: cookie.value});
                }
            }
        );

        chrome.cookies.get(
            {url: SERVER_URL, name: "accessToken"},
            (cookie) => {
                if (cookie) {
                    chrome.storage.local.set({accessToken: cookie.value});
                }
            }
        );


        sendResponse({

            "statusCode": 200,
            "message": "Tokens stored successfully.",
            "success": true

        });


    }
}

const handlePacket = () => {
    console.log('Packet received from extension')
    return (message, sender, sendResponse) => {

        socket.emit('packet', message);

        socket.on('confirmation', () => {
            sendResponse({
                "statusCode": 200,
                "message": "Data Emitted successfully!",
                "success": true
            })
        })


    }
}

export {handleSuccessfulLogin, handlePacket};