(async () => {
    if(!location.href.includes("youtube.com/watch?")) {
        return;
    }

    let IsLargePlayer = false;
    let VolumeDisplayTimeoutId;

    //Retrieve settings. Do once here since this is static
    const SettingsData = await (await fetch(chrome.runtime.getURL("./settings.json"))).json();

    document.addEventListener(EContext.Extension.description, (event) => {
        if(event.detail.newVolume !== undefined) {
            UpdateVolumeDisplay(event.detail.newVolume);
        }
    });

    chrome.runtime.onMessage.addListener(async (message) => {
        if(message.receiver !== "extension") {
            return;
        }

        if (message.request === "setupEventListeners") {
            SetupEventListeners();
            return;
        }
        if (message.request === "removeEventListeners") {
            RemoveEventListeners();
            return;
        }

        Object.keys(SettingsData["UserInterface"]["Data"]).forEach((Section) => {
            SettingsData["UserInterface"]["Data"][Section].forEach((IndividualSetting) => {
                //Update the visibility of the element
                if(message[IndividualSetting.Setting] !== undefined) {
                    if(IndividualSetting.IdentifierType === "ClassName") {
                        document.getElementsByClassName(IndividualSetting.Identifier)[0].ariaLabel = message[IndividualSetting.Setting] ? EToolsTags.NONE : EToolsTags.ForceVisible;
                    }
                }
            });
        });
    });

    //Youtube Player

    const ToggleEnlargePlayer = () => {
        IsLargePlayer = !IsLargePlayer;

        document.getElementById("masthead-container").ariaDisabled = IsLargePlayer.toString();

        //Enable theater mode because it handles moving extra content out of the way for us
        document.getElementsByClassName("ytp-size-button")[0].click();
    }

    const FixHeaderVisibility = () => {
        //Update IsLargePlayer based on whether the player is in theater mode or not
        if(document.getElementById("player-theater-container")) {
            IsLargePlayer = document.getElementById("player-theater-container").childElementCount > 0;
            document.getElementById("masthead-container").ariaDisabled = IsLargePlayer.toString();
        }
    }

    //Volume

    const UpdateVolumeDisplay = (NewVolume) => {
        const MoviePlayer = document.getElementById("movie_player");
        let VolumeDisplay = document.getElementById("--tools-volume-display");

        if(!MoviePlayer) {
            return;
        }

        //Update volume display location
        const rect = MoviePlayer.getBoundingClientRect();
        VolumeDisplay.style.transform = "translate(" + (rect.left + 20) + "px, " + (rect.top + 10) + "px)";

        //Show volume display
        clearTimeout(VolumeDisplayTimeoutId);
        Object.assign(VolumeDisplay, {innerHTML: NewVolume.toString(), ariaLabel: EToolsTags.NONE})
        VolumeDisplayTimeoutId = setTimeout(() => VolumeDisplay.ariaLabel = EToolsTags.NotVisible, 3000);
    };

    //Callbacks

    const RightClickCallback = (event) => {
        const rect = document.getElementsByClassName("html5-video-player")[0].getBoundingClientRect();
        if(event.clientY <= rect.top || event.clientY >= rect.bottom || event.clientX >= rect.right) return;

        event.preventDefault();
        ToggleEnlargePlayer();
    };

    const ScrollCallback = (event) => {
        event.preventDefault();
        const PreviousDelta = event.deltaY < 0 ? 5 : -5;
        DispatchEvent(EContext.Website, {changeVolume: PreviousDelta, reportNew: true});
    };

    //Event listeners

    const Initialize = () => {
        //Disable subtitles by default
        DispatchEvent(EContext.Website, {setSubtitlesEnabled: false});
        //Auto hd
        DispatchEvent(EContext.Website, {newQuality: EContext.p1080});
        FixHeaderVisibility();
    };

    const SetupEventListeners = () => {
        document.body.addEventListener("contextmenu", RightClickCallback, true);
        document.getElementsByClassName("video-stream")[0].addEventListener("wheel", ScrollCallback, false);
    };

    const RemoveEventListeners = () => {
        document.body.removeEventListener("contextmenu", RightClickCallback, true);

        if(document.getElementsByClassName("video-stream")[0]) {
            document.getElementsByClassName("video-stream")[0].removeEventListener("wheel", ScrollCallback, false);
        }
    };

    setTimeout(Initialize, 500);
})();