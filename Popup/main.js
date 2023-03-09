const Main = async () => {
    const SettingsData = await (await fetch(chrome.runtime.getURL("./settings.json"))).json();
    Object.keys(SettingsData).forEach((Section) => {
        let a = Object.assign(document.createElement("a"), {className: "grid-item home-page-button", href: SettingsData[Section].Page, innerHTML: SettingsData[Section].Name});
        document.getElementsByClassName("main-grid-container")[0].appendChild(a);
    });
};

const UserInterface = async () => {
    //Retrieve array of settings and relevant data to update the options for
    const SettingsData = await (await fetch(chrome.runtime.getURL("./settings.json"))).json();
    //Array of settings to get info of from storage
    let SettingsToRetrieve = [];

    Object.keys(SettingsData["UserInterface"]["Data"]).forEach((Section) => {
        //Add section header
        document.getElementsByClassName("options-container")[0].appendChild(Object.assign(document.createElement("h3"), {className: "section_label", innerHTML: Section}));

        //Add menu
        SettingsData["UserInterface"]["Data"][Section].forEach((IndividualSetting) => {
            //Create option
            let div = Object.assign(document.createElement("div"), {className: "option"});
            div.appendChild(Object.assign(document.createElement("h3"), {className: "label", innerHTML: IndividualSetting.Name}));
            let label = Object.assign(document.createElement("label"), {className: "switch"});
            label.appendChild(Object.assign(document.createElement("input"), {id: IndividualSetting.SettingsOptionIdentifier, type: IndividualSetting.Type}));
            label.appendChild(Object.assign(document.createElement("span"), {className: "slider"}));
            div.appendChild(label);
            document.getElementsByClassName("options-container")[0].appendChild(div);

            //Add setting to list of settings to update
            SettingsToRetrieve.push(IndividualSetting.Setting);
        });
    });

    //Retrieve settings and update all options
    chrome.storage.local.get(SettingsToRetrieve).then((result) => {
        Object.keys(SettingsData["UserInterface"]["Data"]).forEach((Section) => {
            SettingsData["UserInterface"]["Data"][Section].forEach((IndividualSetting) => {
                document.getElementById(IndividualSetting.SettingsOptionIdentifier).checked = result[IndividualSetting.Setting];

                //Add event listeners here to avoid extra forEach
                document.getElementById(IndividualSetting.SettingsOptionIdentifier).addEventListener("change", (event) => {
                    //Send message to background worker when the checked status is changed
                    chrome.runtime.sendMessage({receiver: "background-worker", [IndividualSetting.Setting]: event.target.checked});
                });
            });
        });
    });
};

const Functions = async () => {
    //Retrieve array of settings and relevant data to update the options for
    const SettingsData = await (await fetch(chrome.runtime.getURL("./settings.json"))).json();
    //Array of settings to get info of from storage
    let SettingsToRetrieve = [];

    Object.keys(SettingsData["Functions"]["Data"]).forEach((Section) => {
        //Add section header
        document.getElementsByClassName("options-container")[0].appendChild(Object.assign(document.createElement("h3"), {className: "section_label", innerHTML: Section}));

        //Add menu
        SettingsData["Functions"]["Data"][Section].forEach((IndividualSetting) => {
            //Create option
            let div = Object.assign(document.createElement("div"), {className: "option"});
            div.appendChild(Object.assign(document.createElement("h3"), {className: "label", innerHTML: IndividualSetting.Name}));
            let label = Object.assign(document.createElement("label"), {className: "switch"});
            
            
            
            
            label.appendChild(Object.assign(document.createElement("input"), {id: IndividualSetting.SettingsOptionIdentifier, type: IndividualSetting.Type}));
            label.appendChild(Object.assign(document.createElement("span"), {className: "slider"}));




            div.appendChild(label);
            document.getElementsByClassName("options-container")[0].appendChild(div);

            //Add setting to list of settings to update
            SettingsToRetrieve.push(IndividualSetting.Setting);
        });
    });
};

chrome.tabs.query({active: true, lastFocusedWindow: true}).then(async (tabs) => {
    if(!tabs[0] || !tabs[0].url.includes("youtube.com")) {
        return;
    }

    if(location.href.includes("index.html")) {
        Main();
    }
    else if(location.href.includes("user_interface.html")) {
        UserInterface();
    }
    else if(location.href.includes("functions.html")) {
        Functions();
    }
});