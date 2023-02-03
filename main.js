const SendMessageToTab = (message) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
        if(tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
    });
};

const UpdateSettings = () => {
    chrome.storage.local.get(["hideNextVideoButton", "hideVolumeControl", "hideAutoplayControl", "hideSubtitlesButton", "hideMiniplayerButton", "hideTheaterModeButton", "hideFullscreenButton"]).then((result) => {
        SendMessageToTab({receiver: "extension", hideNextVideoButton: result.hideNextVideoButton});
        SendMessageToTab({receiver: "extension", hideVolumeControl: result.hideVolumeControl});
        SendMessageToTab({receiver: "extension", hideAutoplayControl: result.hideAutoplayControl});
        SendMessageToTab({receiver: "extension", hideSubtitlesButton: result.hideSubtitlesButton});
        SendMessageToTab({receiver: "extension", hideMiniplayerButton: result.hideMiniplayerButton});
        SendMessageToTab({receiver: "extension", hideTheaterModeButton: result.hideTheaterModeButton});
        SendMessageToTab({receiver: "extension", hideFullscreenButton: result.hideFullscreenButton});
    });
}

chrome.webNavigation.onCommitted.addListener(async (event) => {
    if(!event.url.includes("youtube.com")) {
        return;
    }

    chrome.scripting.executeScript({target: {tabId: event.tabId}, files: ["core.js", "watch_page.js"]});
    chrome.scripting.insertCSS({target: {tabId: event.tabId}, files: ["clean_ui_common.css", "clean_ui_watch_page.css"]});
});

chrome.webNavigation.onHistoryStateUpdated.addListener(async (event) => {
    if(!event.url.includes("youtube.com")) {
        return;
    }

    chrome.scripting.executeScript({target: {tabId: event.tabId}, files: ["core.js", "watch_page.js"]});
    chrome.scripting.insertCSS({target: {tabId: event.tabId}, files: ["clean_ui_common.css", "clean_ui_watch_page.css"]});
});

chrome.runtime.onMessage.addListener((message) => {
    if(message.receiver !== "background-worker") {
        return;
    }

    if(message.request === "UpdateSettings") {
        UpdateSettings();
    }

    if(message.hideNextVideoButton !== undefined) {
        chrome.storage.local.set({hideNextVideoButton: message.hideNextVideoButton});
        SendMessageToTab({receiver: "extension", hideNextVideoButton: message.hideNextVideoButton});
    }
    if(message.hideVolumeControl !== undefined) {
        chrome.storage.local.set({hideVolumeControl: message.hideVolumeControl});
        SendMessageToTab({receiver: "extension", hideVolumeControl: message.hideVolumeControl});
    }
    if(message.hideAutoplayControl !== undefined) {
        chrome.storage.local.set({hideAutoplayControl: message.hideAutoplayControl});
        SendMessageToTab({receiver: "extension", hideAutoplayControl: message.hideAutoplayControl});
    }
    if(message.hideSubtitlesButton !== undefined) {
        chrome.storage.local.set({hideSubtitlesButton: message.hideSubtitlesButton});
        SendMessageToTab({receiver: "extension", hideSubtitlesButton: message.hideSubtitlesButton});
    }
    if(message.hideMiniplayerButton !== undefined) {
        chrome.storage.local.set({hideMiniplayerButton: message.hideMiniplayerButton});
        SendMessageToTab({receiver: "extension", hideMiniplayerButton: message.hideMiniplayerButton});
    }
    if(message.hideTheaterModeButton !== undefined) {
        chrome.storage.local.set({hideTheaterModeButton: message.hideTheaterModeButton});
        SendMessageToTab({receiver: "extension", hideTheaterModeButton: message.hideTheaterModeButton});
    }
    if(message.hideFullscreenButton !== undefined) {
        chrome.storage.local.set({hideFullscreenButton: message.hideFullscreenButton});
        SendMessageToTab({receiver: "extension", hideFullscreenButton: message.hideFullscreenButton});
    }
});