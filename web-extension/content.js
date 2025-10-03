// Callback function to get the caption text

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

                }, 5000)

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
})