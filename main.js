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

    SettingsToRetrieve = [];
    if(SettingsToRetrieve.length === 0) {
        Object.keys(SettingsData).forEach((Menu) => {
            Object.keys(SettingsData[Menu]["Data"]).forEach((Section) => {
                SettingsData[Menu]["Data"][Section].forEach((IndividualSetting) => {
                    SettingsToRetrieve.push(IndividualSetting.Setting);
                });
            });
        });        
    }

    return SettingsToRetrieve;
};

const SendMessageToTab = (message) => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
        if(tabs[0] && tabs[0].url.includes("youtube.com")) {
            chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                console.log(response, chrome.runtime.lastError);
            });
        }
    });
};

const UpdateSettings = async () => {
    //Array of settings to update, retrieved from JSON data
    const SettingsToRetrieve = await GetSettingsToRetrieve();
    chrome.storage.local.get(SettingsToRetrieve).then((result) => {
        //Create full payload so we only have to send the message once
        let UpdateSettingsMessage = {receiver: "extension"};
        SettingsToRetrieve.forEach((Setting) => {
            UpdateSettingsMessage[Setting] = result[Setting];
        });

        SendMessageToTab(UpdateSettingsMessage);
    });
};

const OnTabUrlChanged = async () => {
    UpdateSettings();
    SendMessageToTab({
        receiver: "extension", 
        request: [
            "injectRelevantScripts",
            "setupEventListeners"
        ]
    });
};

chrome.tabs.onUpdated.addListener((tabId, updateInfo, tab) => {
    //Only update if the url changed
    if(updateInfo.url || updateInfo.status === "complete") {
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

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message.receiver !== "background-worker") {
        return;
    }

    const SettingsToRetrieve = await GetSettingsToRetrieve();
    SettingsToRetrieve.forEach((Setting) => {
        if(message[Setting] !== undefined) {
            chrome.storage.local.set({[Setting]: message[Setting]});
            SendMessageToTab({receiver: "extension", [Setting]: message[Setting]});
        }
    });

    sendResponse("Success: main.js");
});