var clamp = (num, min, max) => Math.min(Math.max(num, min), max);

document.addEventListener(EContext.Website.description, (event) => {
    if(event.detail.setMuted !== undefined) {
        SetPlayerMuted(event, event.detail.setMuted);
    }
    if(event.detail.setVolume !== undefined) {
        SetPlayerVolume(event, event.detail.setVolume);
    }
    if(event.detail.setSubtitlesEnabled !== undefined) {
        SetSubtitlesEnabled(event, event.detail.setSubtitlesEnabled);
    }
    if(event.detail.changeVolume !== undefined) {
        ChangePlayerVolume(event, event.detail.changeVolume);
    }
    if(event.detail.request !== undefined) {
        if(event.detail.request === "GetVolume") {
            GetPlayerVolume(event);            
        }
    }
});

var EnsureVariables = () => {
    YouTubeTools.elements.player = document.getElementById("movie_player");
    YouTubeTools.elements.video = document.getElementsByClassName("video-stream")[0];

    if(!document.getElementById("--tools-volume-display")) {
        const VolumeDisplay = Object.assign(document.createElement("h3"), {id: "--tools-volume-display"});
        document.getElementsByTagName("body")[0].appendChild(VolumeDisplay);
    }
};

var SetPlayerMuted = (event, IsMuted) => {
    if(IsMuted) {
        YouTubeTools.elements.player.mute();
    }
    else {
        YouTubeTools.elements.player.unMute();
    }
};

var SetPlayerVolume = (event, NewVolume) => {
    YouTubeTools.elements.player.setVolume(NewVolume);
};

var SetSubtitlesEnabled = (event, IsEnabled) => {
    EnsureVariables();
    
    if(IsEnabled) {
        YouTubeTools.elements.player.toggleSubtitlesOn();
    }
    else if(YouTubeTools.elements.player.isSubtitlesOn()) {
        YouTubeTools.elements.player.toggleSubtitles();
    }
};

var GetPlayerVolume = (event) => {
    YouTubeTools.DispatchEvent(EContext.Extension, {volume: YouTubeTools.elements.player.getVolume()})
};

var ChangePlayerVolume = (event, Delta) => {
    YouTubeTools.elements.player.setVolume(clamp(YouTubeTools.elements.player.getVolume() + Delta, 0, 100));

    if(event.detail.reportNew === true) {
        YouTubeTools.DispatchEvent(EContext.Extension, {newVolume: YouTubeTools.elements.player.getVolume()})
    }
};

EnsureVariables();