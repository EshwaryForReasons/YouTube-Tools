const SendMessageToTab = (message) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
        if(tabs[0] && tabs[0].url.includes("youtube.com")) {
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

const InjectScriptAndCSS = (event) => {
    if(!event.url.includes("youtube.com")) {
        return;
    }

    chrome.scripting.executeScript({target: {tabId: event.tabId}, files: ["core.js", "watch_page.js"]});
    chrome.scripting.insertCSS({target: {tabId: event.tabId}, files: ["clean_ui_common.css", "clean_ui_watch_page.css"]});
};

chrome.webNavigation.onCommitted.addListener(async event => InjectScriptAndCSS(event));
chrome.webNavigation.onHistoryStateUpdated.addListener(async event => InjectScriptAndCSS(event));

chrome.runtime.onMessage.addListener((message) => {
    if(message.receiver !== "background-worker") {
        return;
    }

    if(message.request === "UpdateSettings") {
        UpdateSettings();
    }

    const SendMessageOnContingency = (option) => {
        if(message[option] !== undefined) {
            chrome.storage.local.set({[option]: message[option]});
            SendMessageToTab({receiver: "extension", [option]: message[option]});
        }
    };

    SendMessageOnContingency("hideNextVideoButton");
    SendMessageOnContingency("hideVolumeControl");
    SendMessageOnContingency("hideAutoplayControl");
    SendMessageOnContingency("hideSubtitlesButton");
    SendMessageOnContingency("hideMiniplayerButton");
    SendMessageOnContingency("hideTheaterModeButton");
    SendMessageOnContingency("hideFullscreenButton");
});