chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "selectQ") {
        console.log("Message received", request);

        function checkAndExecute() {
            const rowgroups = document.querySelectorAll('[role="rowgroup"]');
            if (rowgroups.length > 1) {
                clearInterval(checkInterval);
                const rowgroup = rowgroups[1];
                const random = Math.floor(Math.random() * rowgroup.childNodes.length);
                const questionLink = rowgroup.childNodes[random].childNodes[1].firstChild.firstChild.firstChild.firstChild.firstChild.href;
                chrome.runtime.sendMessage({ redirect: questionLink });
            }
        }

        if (typeof checkInterval === 'undefined') {
            var checkInterval = setInterval(checkAndExecute, 1000);
        }
    }
});

