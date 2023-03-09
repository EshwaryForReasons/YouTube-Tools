let SettingsData = undefined;
let SettingsToRetrieve = [];

const GetSettingsData = async () => {
    if(SettingsData === undefined) {
        SettingsData = await (await fetch(chrome.runtime.getURL("./settings.json"))).json();
    }

    return SettingsData;
};

const GetSettingsToRetrieve = async () => {
    //Make sure the SettingsData is set
    await GetSettingsData();

    if(SettingsToRetrieve.length === 0) {
        Object.keys(SettingsData["UserInterface"]["Data"]).forEach((Section) => {
            SettingsData["UserInterface"]["Data"][Section].forEach((IndividualSetting) => {
                SettingsToRetrieve.push(IndividualSetting.Setting);
            });
        });
    }

    return SettingsToRetrieve;
};

const SendMessageToTab = (message) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
        if(tabs[0] && tabs[0].url.includes("youtube.com")) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
    });
};

const UpdateSettings = async () => {
    //Array of settings to update, retrieved from JSON data
    const SettingsToRetrieve = await GetSettingsToRetrieve();
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

chrome.tabs.onUpdated.addListener((tabId, updateInfo, tab) => {
    //Only update if the url changed
    if(updateInfo.url) {
        OnTabUrlChanged();
    }
});
chrome.tabs.onActivated.addListener((activeInfo) => {
    //Find the tab associated with the tabId and update if it is a YouTube tab
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if(tab && tab.url.includes("youtube.com")) {
            OnTabUrlChanged();
        }
    });
});
chrome.windows.onFocusChanged.addListener((windowId) => {
    //Find the current tab and update if the YouTube tab is selected
    chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
        if(tabs[0] && tabs[0].url.includes("youtube.com")) {
            OnTabUrlChanged();
        }
    });
})

chrome.runtime.onMessage.addListener(async (message) => {
    if(message.receiver !== "background-worker") {
        return;
    }

    if(message.request === "UpdateSettings") {
        UpdateSettings();
        return;
    }

    const SettingsToRetrieve = await GetSettingsToRetrieve();
    SettingsToRetrieve.forEach((Setting) => {
        if(message[Setting] !== undefined) {
            chrome.storage.local.set({[Setting]: message[Setting]});
            SendMessageToTab({receiver: "extension", [Setting]: message[Setting]});
        }
    });
});