// Commenting out all the code related to caption capturing for now

/*

const PACKET_EMIT_INTERVAL = 3000; // Todo: Change

let str = '';
let oldStr = ':::::::::::::::::::::::::::::::';

let sendDataToWorker;
let timeOutForCaption;

const getCaption = (mutationList) => {

    for (const mutation of mutationList) {

        if (mutation.type === 'childList' && mutation.target.innerText.split('\n').length > 2) {
            if (oldStr !== mutation.target.innerText) {
                str += mutation.target.innerText.split('\n')[0] + ' ';
            }
            oldStr = mutation.target.innerText;
        }

        document.getElementById('description-inner').innerText = str;
    }
};

const captionObserver = new MutationObserver(getCaption);

// Callback function to check captionButtonStatus and add mutationObserver to the captions
const getCaptionBtnStatus = (mutationList) => {

    for (const mutation of mutationList) {
        if (mutation.attributeName === 'aria-pressed') {

            const isSubtitleOn = mutation.target.ariaPressed === 'true';

            if (isSubtitleOn) {
                timeOutForCaption = setTimeout(() => {

                    captionObserver.observe(document.querySelector('#ytp-caption-window-container'), {
                        characterData: true,
                        childList: true,
                        subtree: true,
                        attributes: true
                    });

                }, 3000)

                // Start capturing the subtitles after 2 seconds (to allow it to load properly)

                clearInterval(sendDataToWorker);

                sendDataToWorker = setInterval(() => {

                    if (str) {

                        // Todo: Check if chrome exists before using it. Do this everywhere
                        chrome.runtime.sendMessage({
                            type: 'PACKET',
                            data: {
                                caption: str,
                                videoUrl: window.location.href,
                                timestamp: new Date().toLocaleTimeString()
                            }
                        }, (response) => {
                            if (response.success === true) {
                                str = "";
                                oldStr = ":::::::::::::::::::::::::::::::"
                                console.log('Data sent successfully');
                            } else {
                                console.error('Failed to send data:', response.error);
                            }
                        });
                    }

                }, PACKET_EMIT_INTERVAL)

            } else {
                clearInterval(timeOutForCaption);
                clearInterval(sendDataToWorker);
                captionObserver.disconnect();
            }


        }
    }
};

const captionBtnObserver = new MutationObserver(getCaptionBtnStatus);

window.addEventListener('load', () => {
    captionBtnObserver.observe(document.querySelector('.ytp-subtitles-button'), {attributes: true});
});

window.addEventListener('unload', () => {
    captionObserver.disconnect();
    clearInterval(sendDataToWorker);
    clearInterval(timeOutForCaption);
});


 */

(() => {
    // Prevent double injection
    if (window.__floating_blob_extension_initialized__) return;
    window.__floating_blob_extension_initialized__ = true;

    /* ================= ROOT BLOB ================= */

    const blob = document.createElement("div");
    blob.id = "floating-blob-extension-root";
    blob.style.display = "none";
    blob.style.position = "fixed";
    blob.style.zIndex = "2147483645";
    blob.style.left = "24px";
    blob.style.bottom = "24px";

    const mainIcon = document.createElement("div");
    mainIcon.id = "floating-blob-extension-main-icon";
    mainIcon.textContent = "◎";
    blob.appendChild(mainIcon);

    const optionsContainer = document.createElement("div");
    optionsContainer.id = "floating-blob-extension-options";

    /* ================= TEXTAREA ================= */

    const textAreaContainer = document.createElement("div");
    textAreaContainer.id = "floating-textarea-container";
    textAreaContainer.style.display = "none"; // hidden initially
    textAreaContainer.style.left = "50%";
    textAreaContainer.style.top = "50%";

    const textAreaHeader = document.createElement("div");
    textAreaHeader.id = "floating-textarea-header";
    textAreaHeader.innerHTML = `<span>Notes</span><button id="close-textarea-btn">✕</button>`;

    const textArea = document.createElement("textarea");
    textArea.id = "floating-textarea";
    textArea.placeholder = "Write your notes here...";

    const sendButton = document.createElement("button");
    sendButton.id = "floating-textarea-send";
    sendButton.textContent = "Send";

    textAreaContainer.append(textAreaHeader, textArea, sendButton);
    document.body.appendChild(textAreaContainer);

    let isTextAreaVisible = false;

    const sendText = () => {
        const text = textArea.value.trim();
        if (!text) return;

        const cur = document.querySelector(".ytp-time-current")?.innerText || "0:00";
        const dur = document.querySelector(".ytp-time-duration")?.innerText || "0:00";

        chrome.runtime.sendMessage(
            { type: "TEXT_SEND_TAB", payload: { content: text, timeStamp: `${cur}/${dur}` } },
            (res) => {
                if (!res?.ok) console.error(res);
                else textArea.value = "";
            }
        );
    };

    sendButton.addEventListener("click", sendText);

    textArea.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendText();
        }
    });

    textAreaHeader.querySelector("#close-textarea-btn").addEventListener("click", () => {
        isTextAreaVisible = false;
        textAreaContainer.style.display = "none";
    });

    /* ================= OPTION BUTTONS ================= */

    const opt1 = document.createElement("div");
    opt1.className = "floating-blob-option option-1";
    opt1.innerHTML = "<span>1</span>";
    opt1.title = "Take screenshot";

    opt1.addEventListener("click", () => {
        const cur = document.querySelector(".ytp-time-current")?.innerText || "0:00";
        const dur = document.querySelector(".ytp-time-duration")?.innerText || "0:00";

        chrome.runtime.sendMessage({
            type: "SCREENSHOT_CAPTURE_TAB",
            payload: { timeStamp: `${cur}/${dur}` }
        });
    });

    const opt2 = document.createElement("div");
    opt2.className = "floating-blob-option option-2";
    opt2.innerHTML = "<span>2</span>";
    opt2.title = "Toggle Notes";

    opt2.addEventListener("click", () => {
        isTextAreaVisible = !isTextAreaVisible;
        textAreaContainer.style.display = isTextAreaVisible ? "flex" : "none";
        if (isTextAreaVisible) setTimeout(() => textArea.focus(), 50);
    });

    optionsContainer.append(opt1, opt2);
    blob.appendChild(optionsContainer);
    document.body.appendChild(blob);

    /* ================= SHORTCUT ================= */

    let blobVisible = false;

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "y") {
            e.preventDefault();
            console.log("Toggle Floating Blob");
            blobVisible = !blobVisible;
            blob.style.display = blobVisible ? "block" : "none";
        }
    });

    /* ================= DRAG BLOB ================= */

    let dragging = false, sx = 0, sy = 0;

    blob.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        dragging = true;
        const r = blob.getBoundingClientRect();
        sx = e.clientX - r.left;
        sy = e.clientY - r.top;

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
    });

    const move = (e) => {
        if (!dragging) return;
        blob.style.left = `${Math.max(0, e.clientX - sx)}px`;
        blob.style.top = `${Math.max(0, e.clientY - sy)}px`;
        blob.style.bottom = "auto";
    };

    const up = () => {
        dragging = false;
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
    };
})();
