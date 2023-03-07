chrome.tabs.query({active: true, lastFocusedWindow: true}).then(async (tabs) => {
    if(!location.href.includes("user_interface.html") || !tabs[0] || !tabs[0].url.includes("youtube.com")) {
        return;
    }

    //Retrieve array of settings and relevant data to update the options for
    const SettingsData = await (await fetch(chrome.runtime.getURL("./settings.json"))).json();
    //Array of settings to get info of from storage
    let SettingsToRetrieve = [];
    //Array of settings and relevant data to update all options and initialize event handlers
    let SettingsAndData = [];
    Object.keys(SettingsData).forEach((Section) => {
        SettingsData[Section].forEach((IndividualSetting) => {
            SettingsToRetrieve.push(IndividualSetting["Setting"]);
            SettingsAndData.push({
                Setting: IndividualSetting["Setting"],
                SettingsOptionIdentifier: IndividualSetting["SettingsOptionIdentifier"],
                Name: IndividualSetting["Name"],
                Type: IndividualSetting["Type"]
            });
        });
    });

    //Create the options menu
    SettingsAndData.forEach((IndividualSetting) => {
        let div = Object.assign(document.createElement("div"), {className: "option"});
        div.appendChild(Object.assign(document.createElement("h3"), {className: "label", innerHTML: IndividualSetting.Name}));
        let label = Object.assign(document.createElement("label"), {className: "switch"});
        label.appendChild(Object.assign(document.createElement("input"), {id: IndividualSetting.SettingsOptionIdentifier, type: IndividualSetting.Type}));
        label.appendChild(Object.assign(document.createElement("span"), {className: "slider"}));
        div.appendChild(label);
        document.getElementsByClassName("options-container")[0].appendChild(div);
    });

    //Retrieve settings and update all options
    chrome.storage.local.get(SettingsToRetrieve).then((result) => {
        SettingsAndData.forEach((IndividualSetting) => {
            document.getElementById(IndividualSetting.SettingsOptionIdentifier).checked = result[IndividualSetting.Setting];

            //Add event listeners here to avoid extra forEach
            document.getElementById(IndividualSetting.SettingsOptionIdentifier).addEventListener("change", (event) => {
                //Send message to background worker when the checked status is changed
                chrome.runtime.sendMessage({receiver: "background-worker", [IndividualSetting.Setting]: event.target.checked});
            });
        });
    });
});