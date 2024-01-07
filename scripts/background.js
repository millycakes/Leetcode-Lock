chrome.storage.local.set({
    blacklistWebsites: ["instagram.com"],
    lastSolved: -1,
    tags:['array']
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.local.get(["lastSolved", "blacklistWebsites", "tags"], function (item) {
        console.log(tab.url);
        if (tab.url) {
            const matchid = tab.id;
            for (let i = 0; i<item["blacklistWebsites"].length; i++) {
                if (tab.url.includes(item["blacklistWebsites"][i])) {
                    if (item["lastSolved"]==-1 || new Date().getDate()!=item["lastSolved"].getDate()) {
                        let url = 'http://leetcode.com/problemset/?page=1&status=NOT_STARTED';
                        if (item["tags"].length>0) {
                            url+="&topicSlugs=";
                            for (let i = 0; i<item["tags"].length; i++) {
                                if (i==item["tags"].length-1) {
                                    url+=item["tags"][i];
                                }
                                else {
                                    url+=item["tags"][i]+'%2C';
                                }
                            }
                        }
                        chrome.tabs.update(tabId, { url: url }, function() {
                            let messageSent = false;
                        
                            function checkTabStatus(tabId) {
                                if (messageSent) return;
                        
                                chrome.tabs.get(tabId, function(tab) {
                                    if (tab.status === "complete" && !messageSent) {
                                        chrome.tabs.sendMessage(tabId, { action: "selectQ" });
                                        messageSent = true; 
                                    } else {
                                        setTimeout(() => checkTabStatus(tabId), 100); 
                                    }
                                });
                            }
                        
                            checkTabStatus(tabId);
                        });
                        
                    }
                }
            }
        }
    })
  });

  chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.redirect) {
        chrome.tabs.update(sender.tab.id, { url: request.redirect });
    }
});

