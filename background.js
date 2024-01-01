const blacklisted = [];
let coded = false;
let submission = new Date(Date.now() - 2*24*60*60*1000)

chrome.tabs.onUpdated.addListener((tabId, tab) => {
    console.log(tab.url)
    for (let i = 0; i<blacklisted.length; i++) {
        if (tab.url && tab.url.includes(blacklisted)) {
            if (!coded) {

            }
        }
    }
})