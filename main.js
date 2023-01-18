chrome.tabs.onUpdated.addListener((TabId, Tab) => {
    console.log("up")
    if (Tab.url && Tab.url.includes("youtube.com/watch")) {
        const QueryParameters = Tab.url.split("?")[1];
        const URLParameters = new URLSearchParams(QueryParameters);
        console.log(URLParameters);

        chrome.tabs.sendMessage(TabId, {
            type: "NEW",
            videoId: URLParameters.get("v")
        });
    }
});