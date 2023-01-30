const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

window.onload = () => {
    InitExtension();
};

document.addEventListener("--tools-custom-event-website", (event) => {
    if(event.detail.setMuted !== undefined) {
        SetPlayerMuted(event.detail.setMuted);
    }
    if(event.detail.setVolume !== undefined) {
        SetPlayerVolume(event.detail.setVolume)
    }
    if(event.detail.changeVolume !== undefined) {
        ChangePlayerVolume(event.detail.changeVolume)
    }
    if(event.detail.request !== undefined) {
        if(event.detail.request === "GetVolume") {
            GetPlayerVolume();            
        }
    }
});

const InitExtension = () => {
    var MainMutationObserverCallback = (mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if(node.id === "movie_player") {
                    YouTubeTools.elements.player = node;
                }
                else if(node.classList && node.classList[0] && node.classList[0] === "video-stream") {
                    YouTubeTools.elements.video = node;
                }
            });
        });
    };

    const MainMutationObserver = new MutationObserver(MainMutationObserverCallback);
    MainMutationObserver.observe(document.documentElement, {
        attributes: true,
        characterData: true,
        subtree: true,
        childList: true
    });
};

const SetPlayerMuted = (IsMuted) => {
    if(IsMuted) {
        YouTubeTools.elements.player.mute();
    }
    else {
        YouTubeTools.elements.player.unMute();
    }
};

const SetPlayerVolume = (NewVolume) => {
    YouTubeTools.elements.player.setVolume(NewVolume);
};

const GetPlayerVolume = () => {
    document.dispatchEvent(new CustomEvent('--tools-custom-event-extension', {detail: {volume: YouTubeTools.elements.player.getVolume()}}));
}

const ChangePlayerVolume = (Delta) => {
    YouTubeTools.elements.player.setVolume(clamp(YouTubeTools.elements.player.getVolume() + Delta, 0, 100));
};