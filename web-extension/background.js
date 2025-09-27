// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SEND_DATA') {

        console.log(message.data);

        return true; // Keep message channel open for async response
    }
});
