// Get the caption text

const getCaption = (mutationList) => {
    for (const mutation of mutationList) {
        if (mutation.type === "characterData") {
            document.getElementById('description-inner').innerText = mutation.characterData;
        }
    }
};

const captionObserver = new MutationObserver(getCaption);


// Get the caption button status

const getCaptionBtnStatus = (mutationList) => {
    for (const mutation of mutationList) {
        if (mutation.type === "attributes" && mutation.attributeName === 'aria-pressed') {

            const isSubtitleOn = mutation.target.ariaPressed === 'true';

            console.log(isSubtitleOn);

            if (isSubtitleOn) captionObserver.observe(document.querySelectorAll('.ytp-caption-segment')[0], {characterData: true});
            else captionObserver.disconnect();

        }
    }
};

const captionBtnObserver = new MutationObserver(getCaptionBtnStatus);
captionBtnObserver.observe(document.querySelectorAll('.ytp-subtitles-button')[0], { attributes: true });


