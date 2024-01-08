chrome.storage.local.set({
    blacklistWebsites: ["instagram.com"],
    lastSolved: -1,
    tags:['array']
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    chrome.storage.local.get(["lastSolved", "blacklistWebsites", "tags"], function (item) {
        if (tab.url) {
            if (new RegExp("https://leetcode.com/problems/[^/]+/submissions/").test(tab.url)) {
                const problem = tab.url.split("/")[4];
                const request = `https://leetcode.com/api/submissions/${problem}/`;
                fetch(request)
                    .then(response => response.json())
                    .then(data => {
                        for (let i = 1; i < data.submissions_dump.length; i++) {
                            if (data.submissions_dump[i].status_display === "Accepted") {
                                console.log("question already solved");
                                return;
                            }
                        }

                        const id = data.submissions_dump[0].id;
                        const checkUrl = `https://leetcode.com/submissions/detail/${id}/check/`;
                        const interval = setInterval(() => {
                            fetch(checkUrl)
                                .then(response => response.json())
                                .then(data => {
                                    if (data.state === "SUCCESS" && data.status_msg === "Accepted") {
                                        chrome.storage.local.set({lastSolved: new Date().toISOString()});
                                        clearInterval(interval);
                                    }
                                })
                                .catch(error => console.error('Error:', error));
                        }, 1000);
                    })
                    .catch(error => console.log('Error:', error));
            }

            for (let i = 0; i<item["blacklistWebsites"].length; i++) {
                if (tab.url.includes(item["blacklistWebsites"][i])) {
                    if (item["lastSolved"]==-1 || new Date().getDate()!=new Date(item["lastSolved"]).getDate()) {
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

