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
    // Avoid injecting multiple times
    if (window.__floating_blob_extension_initialized__) return;
    window.__floating_blob_extension_initialized__ = true;

    // Create main blob container
    const blob = document.createElement("div");
    blob.id = "floating-blob-extension-root";

    // Hide by default
    blob.style.display = "none";

    // Main icon
    const mainIcon = document.createElement("div");
    mainIcon.id = "floating-blob-extension-main-icon";
    mainIcon.textContent = "◎"; // You can use any symbol/icon/emoji
    blob.appendChild(mainIcon);

    // Options container
    const optionsContainer = document.createElement("div");
    optionsContainer.id = "floating-blob-extension-options";

    // Option 1
    const opt1 = document.createElement("div");
    opt1.className = "floating-blob-option option-1";
    opt1.innerHTML = "<span>1</span>";
    opt1.title = "Take screenshot & upload";

    opt1.addEventListener("click", (e) => {
        e.stopPropagation();

        console.log('opt1 clicked!')

        chrome.runtime.sendMessage(
            { type: "SCREENSHOT_CAPTURE_TAB",

                payload: {
                timeStamp:  `${document.querySelector('.ytp-time-current').innerText}/${document.querySelector('.ytp-time-duration').innerText}`,
                }

            },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Message error:", chrome.runtime.lastError.message);
                    return;
                }

                if (!response?.ok) {
                    console.error("Screenshot/upload failed:", response?.error || response);
                    return;
                }

                console.log("Screenshot uploaded successfully:", response);
                // You can also show a small toast/notification in-page via DOM if you want
            }
        );
    });


    // Option 2
    const opt2 = document.createElement("div");
    opt2.className = "floating-blob-option option-2";
    opt2.innerHTML = "<span>2</span>";
    opt2.title = "Option 2";
    opt2.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("Option 2 clicked");

        chrome.runtime.sendMessage(
            { type: "TEXT_SEND_TAB" },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Message error:", chrome.runtime.lastError.message);
                    return;
                }

                if (!response?.ok) {
                    console.error("Error in sending notes:", response?.error || response);
                    return;
                }

                console.log("Notes added successfully!", response);
                // You can also show a small toast/notification in-page via DOM if you want
            }
        );
    });

    // Option 3
    // const opt3 = document.createElement("div");
    // opt3.className = "floating-blob-option option-3";
    // opt3.innerHTML = "<span>3</span>";
    // opt3.title = "Option 3";
    // opt3.addEventListener("click", (e) => {
    //     e.stopPropagation();
    //     console.log("Option 3 clicked");
    //     // TODO: your logic
    // });

    optionsContainer.appendChild(opt1);
    optionsContainer.appendChild(opt2);
    // optionsContainer.appendChild(opt3);
    blob.appendChild(optionsContainer);

    document.documentElement.appendChild(blob);

    // ========== KEYBOARD SHORTCUT TOGGLE ==========
    let isVisible = false;

    document.addEventListener("keydown", (e) => {
        // Ctrl+Shift+Y (or Cmd+Shift+Y on Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Y') {
            e.preventDefault();
            isVisible = !isVisible;
            blob.style.display = isVisible ? "block" : "none";
            console.log("Floating blob toggled:", isVisible ? "visible" : "hidden");
        }
    });

    // ========== DRAG LOGIC ==========
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialLeft = 24; // default left
    let initialBottom = 24; // default bottom

    // Use left/top instead of bottom/right for easier math
    blob.style.left = initialLeft + "px";
    blob.style.bottom = initialBottom + "px";

    const onMouseDown = (e) => {
        // Only left click, ignore options clicks
        if (e.button !== 0) return;

        isDragging = true;
        blob.classList.add("dragging");

        // Current position
        const rect = blob.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        e.preventDefault();
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const onMouseMove = (e) => {
        if (!isDragging) return;

        const newLeft = e.clientX - startX;
        const newTop = e.clientY - startY;

        const blobRect = blob.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const clampedLeft = clamp(newLeft, 0, vw - blobRect.width);
        const clampedTop = clamp(newTop, 0, vh - blobRect.height);

        blob.style.left = clampedLeft + "px";
        blob.style.top = clampedTop + "px";
        blob.style.bottom = "auto"; // so top takes effect
        blob.style.right = "auto";
    };

    const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        blob.classList.remove("dragging");
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    // Attach listener to the blob itself
    blob.addEventListener("mousedown", onMouseDown);
})();