var YouTubeTools = {
    messages: [],
    elements: {},
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

var EQualityOptions = Object.freeze({
    NONE: Symbol("NONE"),
    p144: Symbol("tiny"),
    p240: Symbol("small"),
    p360: Symbol("medium"),
    p480: Symbol("large"),
    p720: Symbol("hd720"),
    p1080: Symbol("hd1080"),
});

var DispatchEvent = function(SendToContext, Event) {
    document.dispatchEvent(new CustomEvent(SendToContext.description, {detail: Event}));
};