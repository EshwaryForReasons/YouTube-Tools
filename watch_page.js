(() => {
    const VolumeDisplayId = "--tools-volume-display"

    let YoutubePlayer;
    let IsLargePlayer = false;
    let VolumeDisplayTimeoutId;

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {type, value, videoId} = obj;

        if(type === "NEW") {
            CurrentVideo = VideoID;
            NewVideoLoaded();
        }
    });

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    //Youtube Player

    const EnsureYouTubePlayer = () => {
        if(!YoutubePlayer) {
            YoutubePlayer = document.getElementsByClassName("video-stream")[0];
        }
    }

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
        const rect = YoutubePlayer.getBoundingClientRect();
        document.getElementById(VolumeDisplayId).style.transform = "translate(" + (rect.left + 20) + "px, " + (rect.top + 10) + "px)";
    }

    const ChangeVolume = () => {
        EnsureYouTubePlayer();

        //Make sure we are not muted
        YoutubePlayer.muted = false;

        //For some reason deltaY < 0 means the user scrolled up
        YoutubePlayer.volume = Math.round((clamp(YoutubePlayer.volume + (event.deltaY < 0 ? 0.05 : -0.05), 0, 1) + Number.EPSILON) * 100) / 100;

        //Show new volume
        if (!document.getElementById(VolumeDisplayId) && document.getElementById("player-container-inner")) {
            let VolumeDisplay = document.createElement("h3");
            VolumeDisplay.id = VolumeDisplayId;
            document.getElementsByTagName("body")[0].appendChild(VolumeDisplay);
        }
        
        clearTimeout(VolumeDisplayTimeoutId);
        UpdateVolumeDisplayLocation()
        document.getElementById(VolumeDisplayId).innerHTML = YoutubePlayer.volume.toString();
        document.getElementById(VolumeDisplayId).ariaLabel = null;
        VolumeDisplayTimeoutId = setTimeout(VolumeDisplayTimeoutCallback, 3000);
    }

    const VolumeDisplayTimeoutCallback = () => {
        document.getElementById(VolumeDisplayId).ariaLabel = "--tools-tags-not-visible";
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
        ChangeVolume();
    };

    document.body.addEventListener("contextmenu", RightClickCallback, true);
    document.getElementsByClassName("video-stream")[0].addEventListener("wheel", ScrollCallback, false);
})();