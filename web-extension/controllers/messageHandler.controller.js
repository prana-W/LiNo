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
    // Capture the currently visible tab in the window of the sender
    const windowId = sender.tab?.windowId ?? undefined;

    chrome.tabs.captureVisibleTab(windowId, { format: "png" }, (dataUrl) => {
        if (chrome.runtime.lastError) {
            console.error("Screenshot error:", chrome.runtime.lastError.message);
            sendResponse({ ok: false, error: chrome.runtime.lastError.message });
            return;
        }

        // Now send this image to your server
        (async () => {
            try {
                const res = await fetch(SERVER_URL + "/api/v1/screenshot", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        credentials: "include"
                    },
                    body: JSON.stringify({
                        image: dataUrl,
                        tabUrl: sender.tab?.url || null,
                        capturedAt: new Date().toISOString()
                    })
                });

                const body = await res
                    .json()
                    .catch(() => null); // in case server doesn't return JSON

                sendResponse({
                    ok: res.ok,
                    status: res.status,
                    body
                });
            } catch (err) {
                console.error("Upload error:", err);
                sendResponse({
                    ok: false,
                    error: String(err)
                });
            }
        })();

        // Keep the message channel open for async sendResponse
        return true;
    });

    // Important: return true here as well to indicate async response
    return true;

}
export {handleSuccessfulLogin, handlePacket, handleScreenshot};