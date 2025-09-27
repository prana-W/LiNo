// Callback function to get the caption text

let str = '';
let oldStr = ':::::::::::::::::::::::::::::::';

let sendDataToWorker;

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
                setTimeout(() => {

                    captionObserver.observe(document.querySelector('#ytp-caption-window-container'), {
                        characterData: true,
                        childList: true,
                        subtree: true,
                        attributes: true
                    });

                }, 2000)

                clearInterval(sendDataToWorker);

                sendDataToWorker = setInterval(() => {
                    console.log('yeah!!!!')

                }, 10000)

            } else {
                captionObserver.disconnect();
                clearInterval(sendDataToWorker);
            }


        }
    }
};

const captionBtnObserver = new MutationObserver(getCaptionBtnStatus);

window.addEventListener('load', () => {
    captionBtnObserver.observe(document.querySelector('.ytp-subtitles-button'), {attributes: true});
});