var YouTubeTools = {
    messages: [],
    elements: {}
};

YouTubeTools.DispatchEvent = function(event) {
    document.dispatchEvent(new CustomEvent('--tools-custom-event-website', {detail: event}));
};