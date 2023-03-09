(() => {
    const EnsureCorrectPage = () => {
        if(!location.href.includes("youtube.com/watch?") && location.href.includes("youtube.com/results?")) {
            return true;
        }

        return false;
    };    

    chrome.runtime.onMessage.addListener((message) => {
        if(!EnsureCorrectPage() || message.receiver !== "extension") {
            return;
        }

        const UpdateElementVisibility = (element, condition) => {
            if(message[condition] !== undefined) {
                Array.from(document.getElementsByTagName("ytd-rich-section-renderer")).forEach((element) => {
                    element.ariaLabel = message[condition] ? EToolsTags.NONE : EToolsTags.ForceVisible;
                });
            }
        }

        UpdateElementVisibility("ytd-rich-section-renderer", "hideShortsSection");
    });
})();