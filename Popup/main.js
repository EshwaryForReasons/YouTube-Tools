let PageHistory = [];

const ChangePage = (NewPage) => {
    PageHistory.push(NewPage);
    
    //Clear page
    document.getElementById("main-grid-container").replaceChildren();
    document.getElementById("options-container").replaceChildren();

    if(NewPage === "Main") {
        Main();
    }
    else if (NewPage === "UserInterface") {
        UpdateHeader("User Interface", true);
        CreateMenu("UserInterface");
    }
    else if (NewPage === "Functions") {
        UpdateHeader("Functions", true);
        CreateMenu("Functions");
    }
};

const BackPage = () => {
    if(PageHistory.length > 1) {
        PageHistory.pop();
        ChangePage(PageHistory.pop());
    }
};

const CreateMenu = async (MenuSection) => {
    //Retrieve array of settings and relevant data to update the options for
    const SettingsData = await (await fetch(chrome.runtime.getURL("./settings.json"))).json();
    //Array of settings to get info of from storage
    let SettingsToRetrieve = [];

    Object.keys(SettingsData[MenuSection]["Data"]).forEach((Section) => {
        //Add section header
        document.getElementById("options-container").appendChild(Object.assign(document.createElement("h3"), {className: "section_label", innerHTML: Section}));

        //Add menu
        SettingsData[MenuSection]["Data"][Section].forEach((IndividualSetting) => {
            //Create option
            let div = Object.assign(document.createElement("div"), {className: "option"});
            div.appendChild(Object.assign(document.createElement("h3"), {className: "label", innerHTML: IndividualSetting.Name}));

            if (IndividualSetting.Type === "checkbox") {
                let label = Object.assign(document.createElement("label"), {className: "switch"});
                label.appendChild(Object.assign(document.createElement("input"), {id: IndividualSetting.Setting, type: IndividualSetting.Type}));
                label.appendChild(Object.assign(document.createElement("span"), {className: "slider"}));
                div.appendChild(label);
            }
            else if (IndividualSetting.Type === "dropdown") {
                let label = Object.assign(document.createElement("label"), {className: "dropdown-container"});
                label.appendChild(Object.assign(document.createElement("button"), {className: "dropdown-button", id: IndividualSetting.Setting, innerHTML: "Options"}));
                let InnerDiv = Object.assign(document.createElement("div"), {className: "dropdown-content"});

                IndividualSetting.Options.forEach((Option) => {
                    InnerDiv.appendChild(Object.assign(document.createElement("button"), {className: "dropdown-item", id: IndividualSetting.Setting + "-button-" + Option, innerHTML: Option}));
                });

                label.appendChild(InnerDiv);
                div.appendChild(label);
            }
            
            document.getElementById("options-container").appendChild(div);

            //Add setting to list of settings to update
            SettingsToRetrieve.push(IndividualSetting.Setting);
        });
    });

    //Retrieve settings and update all options
    chrome.storage.local.get(SettingsToRetrieve).then((result) => {
        Object.keys(SettingsData[MenuSection]["Data"]).forEach((Section) => {
            SettingsData[MenuSection]["Data"][Section].forEach((IndividualSetting) => {
                if(IndividualSetting.Type === "checkbox") {
                    document.getElementById(IndividualSetting.Setting).checked = result[IndividualSetting.Setting];

                    //Add event listeners here to avoid extra forEach
                    document.getElementById(IndividualSetting.Setting).addEventListener("change", (event) => {
                        //Send message to background worker when the checked status is changed
                        chrome.runtime.sendMessage({receiver: "background-worker", [IndividualSetting.Setting]: event.target.checked});
                    });
                }
                else if (IndividualSetting.Type === "dropdown") {
                    document.getElementById(IndividualSetting.Setting).innerHTML = result[IndividualSetting.Setting];

                    IndividualSetting.Options.forEach((Option) => {
                        document.getElementById(IndividualSetting.Setting + "-button-" + Option).addEventListener("click", (event) => {
                            document.getElementById(IndividualSetting.Setting).innerHTML = Option;
                            chrome.runtime.sendMessage({receiver: "background-worker", [IndividualSetting.Setting]: Option});
                        });
                    });
                }
            });
        });
    });
};

const UpdateHeader = (NewPageTitle, bEnableBackButton) => {
    Object.assign(document.getElementById("title"), {innerHTML: NewPageTitle});
    Object.assign(document.getElementById("back-button-container"), {style: "display: " + (bEnableBackButton ? "block" : "none")});
};

const Main = async () => {
    UpdateHeader("Eshwary's YouTube Tools", false);

    const SettingsData = await (await fetch(chrome.runtime.getURL("./settings.json"))).json();
    Object.keys(SettingsData).forEach((Section) => {
        let a = Object.assign(document.createElement("a"), {className: "grid-item", innerHTML: SettingsData[Section].Name, onclick: (event) => {
            ChangePage(Section);
        }});
        document.getElementById("main-grid-container").appendChild(a);
    });
};

chrome.tabs.query({active: true, lastFocusedWindow: true}).then(async (tabs) => {
    if(tabs[0] && tabs[0].url.includes("youtube.com")) {
        ChangePage("Main");
        document.getElementById("back-button").addEventListener("click", (event) => {
            BackPage();
        });
    }
});