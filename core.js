var YouTubeTools = {
    messages: [],
    elements: {}
};

var EToolsTags = Object.freeze({
    NONE: "NONE",
    NotVisible: "--tools-tags-not-visible",
    ForceVisible: "--tools-tags-force-visible"
});

var EContext = Object.freeze({
    NONE: Symbol("NONE"),
    Extension: Symbol("--tools-custom-event-extension"),
    Website: Symbol("--tools-custom-event-website")
});

YouTubeTools.DispatchEvent = function(SendToContext, Event) {
    document.dispatchEvent(new CustomEvent(SendToContext.description, {detail: Event}));
};