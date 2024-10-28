// content.js



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in content script:', request);
    debugger;
    if (request.action === 'startRecognition') {
        console.log('Starting speech recognition...');
        // Start recognition code...
        sendResponse({ status: 'Voice recognition started' });
    }
});
