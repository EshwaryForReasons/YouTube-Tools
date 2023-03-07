(() => {
    chrome.runtime.onMessage.addListener((message) => {
        if(message.receiver === "extension" && message.request === "injectRelevantScripts") {
            InjectRelevantScripts();
        }
    });

    const InjectRelevantScripts = () => {
        const website_insert_scripts = ["core.js", "scripts.js"];
        website_insert_scripts.forEach((script) => {
            var ScriptElement = document.createElement("script");
            ScriptElement.src = chrome.runtime.getURL(script);
            (document.head || document.documentElement).appendChild(ScriptElement);
        });
    };
})();