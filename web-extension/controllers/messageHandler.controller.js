import {socket} from "../socket/socket.js";
import {SERVER_URL} from "../constants.js";

// Todo: Wrap everything in try-catch block

const handleSuccessfulLogin = (message, sender, sendResponse) => {
    console.log('User logged in to LiNo');

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

const handlePacket = (message, sender, sendResponse) => {
    console.log('Packet received from LiNo')

    socket.emit('packet', message);

    socket.on('confirmation', () => {
        sendResponse({
            "statusCode": 200,
            "message": "Data Emitted successfully!",
            "success": true
        })
    })

}

const handleAccessTokenExpiry = async (message, sender, sendResponse) => {


    try {

        const response = await fetch(`${SERVER_URL}/auth/refresh-token`);

        if (!response || !response.ok) {
            throw new Error('There was an error while getting the refresh Token from the server. Try again or login back.');
        }

        const data = response.json();

        console.log(data);

        chrome.cookies.get(
            {url: SERVER_URL, name: "accessToken"},
            (cookie) => {
                if (cookie) {
                    chrome.storage.local.set({accessToken: cookie.value});
                }
            }
        );

        // Todo: Now validate the response and send the data to the background script if the refresh token is found and then set the new tokens in the storage

    }

    catch (err) {

    }

}

const handleScreenshot = async (message, sender, sendResponse) => {
    const windowId = sender.tab?.windowId;

    chrome.tabs.captureVisibleTab(windowId, { format: "png" }, async (dataUrl) => {
        if (chrome.runtime.lastError) {
            sendResponse({ ok: false, error: chrome.runtime.lastError.message });
            return;
        }

        try {
            // Convert base64 → Blob
            const blob = await (await fetch(dataUrl)).blob();

            const formData = new FormData();

            formData.append("screenshot", blob, `${sender.tab?.url}` || "screenshot.png");

            const res = await fetch(`${SERVER_URL}/api/v1/services/screenshot`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            const body = await res.json().catch(() => null);

            sendResponse({
                ok: res.ok,
                status: res.status,
                body,
            });
        } catch (err) {
            sendResponse({
                ok: false,
                error: err.message,
            });
        }
    });

    return true; // keep channel open
};

export {handleSuccessfulLogin, handlePacket, handleScreenshot};