(() => {
    const VolumeDisplayId = "--tools-volume-display"

    let IsLargePlayer = false;
    let VolumeDisplayTimeoutId;
    let PreviousDelta;

    document.addEventListener("--tools-custom-event-extension", (event) => {
        if(event.detail.volume !== undefined) {
            FinishChangeVolume(event.detail.volume);
        }
    });

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    //Youtube Player

    const ToggleEnlargePlayer = () => {
        IsLargePlayer = !IsLargePlayer;

        //Remove topbar
        document.getElementById("masthead-container").ariaDisabled = IsLargePlayer.toString();

        //Enable theater mode because it handles moving extra content out of the way for us
        document.getElementsByClassName("ytp-size-button")[0].click();

        setTimeout(UpdateVolumeDisplayLocation, 100);
    }

    //Volume

    const UpdateVolumeDisplayLocation = () => {
        const rect = document.getElementById("movie_player").getBoundingClientRect();
        document.getElementById(VolumeDisplayId).style.transform = "translate(" + (rect.left + 20) + "px, " + (rect.top + 10) + "px)";
    }

    const FinishChangeVolume = (CurrentVolume) => {
        const NewVolume = clamp(CurrentVolume + PreviousDelta, 0, 100);
        YouTubeTools.DispatchEvent({setMuted: (NewVolume <= 0 ? true : false), setVolume: NewVolume});
        
        //Show new volume
        if (!document.getElementById(VolumeDisplayId) && document.getElementById("player-container-inner")) {
            let VolumeDisplay = document.createElement("h3");
            VolumeDisplay.id = VolumeDisplayId;
            document.getElementsByTagName("body")[0].appendChild(VolumeDisplay);
        }
        
        clearTimeout(VolumeDisplayTimeoutId);
        UpdateVolumeDisplayLocation()
        document.getElementById(VolumeDisplayId).innerHTML = NewVolume.toString();
        document.getElementById(VolumeDisplayId).ariaLabel = null;
        VolumeDisplayTimeoutId = setTimeout(() => {
            document.getElementById(VolumeDisplayId).ariaLabel = "--tools-tags-not-visible";
        }, 3000);

        PreviousDelta = 0;
    }

    //Callbacks

    const RightClickCallback = (event) => {
        const rect = document.getElementsByClassName("html5-video-player")[0].getBoundingClientRect();
        if(event.clientY <= rect.top || event.clientY >= rect.bottom || event.clientX >= rect.right) return;

        event.preventDefault();
        ToggleEnlargePlayer();
    };

    const ScrollCallback = (event) => {
        event.preventDefault();
        PreviousDelta = event.deltaY < 0 ? 5 : -5;
        YouTubeTools.DispatchEvent({request: "GetVolume"});
    };

    //Inject relevant scripts
    const website_insert_scripts = ["core.js", "scripts.js"];
    website_insert_scripts.forEach((script) => {
        var ScriptElement = document.createElement("script");
        ScriptElement.src = chrome.runtime.getURL(script);
        (document.head || document.documentElement).appendChild(ScriptElement);
    });

    //Setup event listners
    document.body.addEventListener("contextmenu", RightClickCallback, true);
    document.getElementsByClassName("video-stream")[0].addEventListener("wheel", ScrollCallback, false);
})();