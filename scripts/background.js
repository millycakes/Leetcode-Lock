chrome.storage.local.set({
    blacklistWebsites: ["youtube.com"],
    lastSolved: -1
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.local.get(["lastSolved", "blacklistWebsites"], function (item) {
        console.log(tab.url);
        if (tab.url) {
            for (let i = 0; i<item["blacklistWebsites"].length; i++) {
                if (tab.url.includes(item["blacklistWebsites"][i])) {
                    if (item["lastSolved"]==-1 || new Date().getDate()!=item["lastSolved"].getDate()) {
                        chrome.tabs.update(tab.id, {url: 'http://leetcode.com'});
                    }
                }
            }
        }
    })
  });

