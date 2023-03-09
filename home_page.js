(() => {
    if(location.href.includes("youtube.com/watch?")) {
        return;
    }

    chrome.runtime.onMessage.addListener((message) => {
        if(message.receiver !== "extension") {
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