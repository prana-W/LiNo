// Callback function to get the caption text

const getCaption = (mutationList) => {

    for (const mutation of mutationList) {

            document.getElementById('description-inner').innerText = mutation.target.innerText;
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

                    captionObserver.observe(document.querySelector('#ytp-caption-window-container'), {characterData: true, childList: true, subtree: true});

                }, 2000)
            }

            else captionObserver.disconnect();


        }
    }
};

const captionBtnObserver = new MutationObserver(getCaptionBtnStatus);
captionBtnObserver.observe(document.querySelector('.ytp-subtitles-button'), { attributes: true });