const RetrieveSettingsFromSettingsData = async () => {
    let SettingsData = await (await fetch(chrome.runtime.getURL("./settings.json"))).json();
    let SettingsToRetrieve = [];
    Object.keys(SettingsData).forEach((Section) => {
        SettingsData[Section].forEach((Setting) => {
            SettingsToRetrieve.push(Setting["Setting"]);
        });
    });

    return SettingsToRetrieve;
}

const SendMessageToTab = (message) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
        if(tabs[0] && tabs[0].url.includes("youtube.com")) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
    });
};

const UpdateSettings = async () => {
    //Array of settings to update, retrieved from JSON data
    const SettingsToRetrieve = await RetrieveSettingsFromSettingsData();
    chrome.storage.local.get(SettingsToRetrieve).then((result) => {
        SettingsToRetrieve.forEach((Setting) => {
            SendMessageToTab({receiver: "extension", [Setting]: result[Setting]});
        });
    });
};

const OnTabUrlChanged = async () => {
    UpdateSettings();
    SendMessageToTab({receiver: "extension", request: "injectRelevantScripts"});
    SendMessageToTab({receiver: "extension", request: "setupEventListeners"});
};

chrome.tabs.onUpdated.addListener((tabId, updateInfo, tab) => {OnTabUrlChanged();});
chrome.tabs.onActivated.addListener((activeInfo) => {OnTabUrlChanged();});
chrome.windows.onFocusChanged.addListener((windowId) => {OnTabUrlChanged();})

chrome.runtime.onMessage.addListener(async (message) => {
    if(message.receiver !== "background-worker") {
        return;
    }

    if(message.request === "UpdateSettings") {
        UpdateSettings();
        return;
    }

    const SettingsToRetrieve = await RetrieveSettingsFromSettingsData();
    SettingsToRetrieve.forEach((Setting) => {
        if(message[Setting] !== undefined) {
            chrome.storage.local.set({[Setting]: message[Setting]});
            SendMessageToTab({receiver: "extension", [Setting]: message[Setting]});
        }
    });
});