chrome.tabs.onUpdated.addListener((TabId, Tab) => {
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

const InsertCorrectCSS = async (url, tabId) => {
    if (url.includes("youtube.com/watch?")) {
        chrome.scripting.insertCSS({target: {tabId: tabId}, files: ["clean_ui_watch_page.css"]});
        chrome.scripting.removeCSS({target: {tabId: tabId}, files: ["clean_ui_home_page.css"]});
        chrome.scripting.executeScript({target: {tabId: tabId}, files: ["watch_page.js"]});
    }
    else if (url.includes("youtube.com/@")) {
        chrome.scripting.removeCSS({target: {tabId: tabId}, files: ["clean_ui_home_page.css", "clean_ui_watch_page.css"]});
    }
    else if (url.includes("youtube.com")) {
        chrome.scripting.insertCSS({target: {tabId: tabId}, files: ["clean_ui_home_page.css"]});
        chrome.scripting.removeCSS({target: {tabId: tabId}, files: ["clean_ui_watch_page.css"]});
    }
};

chrome.webNavigation.onCommitted.addListener(async (event) => {
    InsertCorrectCSS(event.url, event.tabId);
});

chrome.webNavigation.onHistoryStateUpdated.addListener(async (event) => {
    InsertCorrectCSS(event.url, event.tabId);
});