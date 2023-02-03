var clamp = (num, min, max) => Math.min(Math.max(num, min), max);

(() => {
    let IsLargePlayer = false;
    let VolumeDisplayTimeoutId;

    document.addEventListener(EContext.Extension.description, (event) => {
        if(event.detail.newVolume !== undefined) {
            UpdateVolumeDisplay(event.detail.newVolume);
        }
    });

    chrome.runtime.onMessage.addListener((message) => {
        if(message.receiver !== "extension") {
            return;
        }

        if(message.hideNextVideoButton !== undefined) {
            document.getElementsByClassName("ytp-next-button")[0].ariaLabel = message.hideNextVideoButton ? EToolsTags.NotVisible : EToolsTags.NONE;
        }
        if(message.hideVolumeControl !== undefined) {
            document.getElementsByClassName("ytp-volume-area")[0].ariaLabel = message.hideVolumeControl ? EToolsTags.NotVisible : EToolsTags.NONE;
        }
        if(message.hideAutoplayControl !== undefined) {
            document.getElementsByClassName("ytp-autonav-toggle-button-container")[0].ariaLabel = message.hideAutoplayControl ? EToolsTags.NotVisible : EToolsTags.NONE;
        }
        if(message.hideSubtitlesButton !== undefined) {
            document.getElementsByClassName("ytp-subtitles-button")[0].ariaLabel = message.hideSubtitlesButton ? EToolsTags.NotVisible : EToolsTags.NONE;
        }
        if(message.hideMiniplayerButton !== undefined) {
            document.getElementsByClassName("ytp-miniplayer-button")[0].ariaLabel = message.hideMiniplayerButton ? EToolsTags.NotVisible : EToolsTags.NONE;
        }
        if(message.hideTheaterModeButton !== undefined) {
            document.getElementsByClassName("ytp-size-button")[0].ariaLabel = message.hideTheaterModeButton ? EToolsTags.NotVisible : EToolsTags.NONE;
        }
        if(message.hideFullscreenButton !== undefined) {
            document.getElementsByClassName("ytp-fullscreen-button")[0].ariaLabel = message.hideFullscreenButton ? EToolsTags.NotVisible : EToolsTags.NONE;
        }
    });

    //Youtube Player

    const ToggleEnlargePlayer = () => {
        IsLargePlayer = !IsLargePlayer;

        //Remove topbar
        document.getElementById("masthead-container").ariaDisabled = IsLargePlayer.toString();

        //Enable theater mode because it handles moving extra content out of the way for us
        document.getElementsByClassName("ytp-size-button")[0].click();
    }

    //Volume

    const UpdateVolumeDisplay = (NewVolume) => {
        let MoviePlayer = document.getElementById("movie_player");
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
        YouTubeTools.DispatchEvent(EContext.Website, {changeVolume: PreviousDelta, reportNew: true});
    };

    //Inject relevant scripts
    const website_insert_scripts = ["core.js", "scripts.js"];
    website_insert_scripts.forEach((script) => {
        var ScriptElement = document.createElement("script");
        ScriptElement.src = chrome.runtime.getURL(script);
        (document.head || document.documentElement).appendChild(ScriptElement);
    });

    if(location.href.includes("youtube.com/watch?")) {
        //Setup event listners
        document.body.addEventListener("contextmenu", RightClickCallback, true);
        document.getElementsByClassName("video-stream")[0].addEventListener("wheel", ScrollCallback, false);

        //Disable subtitles by default
        YouTubeTools.DispatchEvent(EContext.Website, {setSubtitlesEnabled: false});
    }

    //Update all settings
    chrome.runtime.sendMessage({receiver: "background-worker", request: "UpdateSettings"});
})();