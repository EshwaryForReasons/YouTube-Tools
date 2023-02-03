var OnInputChanged_NextVideoButton = (event) => {
    chrome.runtime.sendMessage({receiver: "background-worker", hideNextVideoButton: event.target.checked});
}

var OnInputChanged_VolumeControl = (event) => {
    chrome.runtime.sendMessage({receiver: "background-worker", hideVolumeControl: event.target.checked});
}

var OnInputChanged_AutoplayControl = (event) => {
    chrome.runtime.sendMessage({receiver: "background-worker", hideAutoplayControl: event.target.checked});
}

var OnInputChanged_SubtitlesButton = (event) => {
    chrome.runtime.sendMessage({receiver: "background-worker", hideSubtitlesButton: event.target.checked});
}

var OnInputChanged_MiniplayerButton = (event) => {
    chrome.runtime.sendMessage({receiver: "background-worker", hideMiniplayerButton: event.target.checked});
}

var OnInputChanged_TheaterModeButton = (event) => {
    chrome.runtime.sendMessage({receiver: "background-worker", hideTheaterModeButton: event.target.checked});
}

var OnInputChanged_FullscreenButton = (event) => {
    chrome.runtime.sendMessage({receiver: "background-worker", hideFullscreenButton: event.target.checked});
}

chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
    if(tabs[0] && tabs[0].url.includes("youtube.com/watch?")) {
        document.getElementById("--tools-input-checkbox-next-video-button").addEventListener("change", OnInputChanged_NextVideoButton);
        document.getElementById("--tools-input-checkbox-volume-control").addEventListener("change", OnInputChanged_VolumeControl);
        document.getElementById("--tools-input-checkbox-autoplay-control").addEventListener("change", OnInputChanged_AutoplayControl);
        document.getElementById("--tools-input-checkbox-subtitles-button").addEventListener("change", OnInputChanged_SubtitlesButton);
        document.getElementById("--tools-input-checkbox-miniplayer-button").addEventListener("change", OnInputChanged_MiniplayerButton);
        document.getElementById("--tools-input-checkbox-theater-mode-button").addEventListener("change", OnInputChanged_TheaterModeButton);
        document.getElementById("--tools-input-checkbox-fullscreen-button").addEventListener("change", OnInputChanged_FullscreenButton);
    }
});

chrome.tabs.query({active: true, lastFocusedWindow: true}).then((tabs) => {
    if(tabs[0] && tabs[0].url.includes("youtube.com/watch?")) {
        chrome.storage.local.get(["hideNextVideoButton", "hideVolumeControl", "hideAutoplayControl", "hideSubtitlesButton", "hideMiniplayerButton", "hideTheaterModeButton", "hideFullscreenButton"]).then((result) => {
            document.getElementById("--tools-input-checkbox-next-video-button").checked = result.hideNextVideoButton;
            document.getElementById("--tools-input-checkbox-volume-control").checked = result.hideVolumeControl;
            document.getElementById("--tools-input-checkbox-autoplay-control").checked = result.hideAutoplayControl;
            document.getElementById("--tools-input-checkbox-subtitles-button").checked = result.hideSubtitlesButton;
            document.getElementById("--tools-input-checkbox-miniplayer-button").checked = result.hideMiniplayerButton;
            document.getElementById("--tools-input-checkbox-theater-mode-button").checked = result.hideTheaterModeButton;
            document.getElementById("--tools-input-checkbox-fullscreen-button").checked = result.hideFullscreenButton;
        });
    }
});