const addNewLink = (newAddress) => {
    const blacklisted = document.querySelector('.links');
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(newAddress));

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('delete-icon');
    const iconImg = document.createElement('img');
    iconImg.src = '../assets/delete.png'; 
    iconImg.style.width = '16px'; 
    iconImg.style.height = '16px';
    deleteIcon.appendChild(iconImg);
    button.appendChild(deleteIcon);

    blacklisted.appendChild(button);

    button.querySelector('.delete-icon').addEventListener('click', function (e) {
        e.stopPropagation();
        e.target.parentElement.parentElement.remove();
        chrome.storage.local.get("blacklistWebsites", function (item) {
            chrome.storage.local.set({
                blacklistWebsites: item["blacklistWebsites"].splice(item["blacklistWebsites"].indexOf(newAddress), 1)
            })
        })
    });
}

chrome.storage.onChanged.addListener(function(changes) {
    if (changes.blacklistWebsites) {
        if (changes.blacklistWebsites.oldValue.length > changes.blacklistWebsites.newValue.length) {
            return;
        }
        const newBlacklist = changes.blacklistWebsites.newValue
        const newAddress = newBlacklist[newBlacklist.length - 1]
        addNewLink(newAddress);
    }
})

document.addEventListener("DOMContentLoaded", function() {

    chrome.storage.local.get(["blacklistWebsites", "tags"], function(item) {
        for (let i = 0; i < item["blacklistWebsites"].length; i++) {
            addNewLink(item["blacklistWebsites"][i]);
        }
        for (let i = 0; i<item["tags"].length; i++) {
            const button = document.getElementById(item["tags"][0]);
            button.style.backgroundColor = '#f08e0c';
        }
    })

    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault()
        const address = document.getElementById('website').value;
        const pattern = new RegExp("[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:.(com|net|org|io|edu|info|gov))+");
        if (!pattern.test(address)) {
            document.getElementById("form-message").style.color = "red";
            document.getElementById("form-message").innerHTML = `Address is not valid (should be of format websitename.xxx)`;
        } else {
            chrome.storage.local.get("blacklistWebsites", function (item) {
                const prevBlacklist = item["blacklistWebsites"];
                if (prevBlacklist.includes(address)) {
                    document.getElementById("form-message").style.color = "red";
                    document.getElementById("form-message").innerHTML = `Address already in blacklist.`;
                    
                } else {
                    const newBlacklist = prevBlacklist.concat(address)
                    chrome.storage.local.set({
                        blacklistWebsites: newBlacklist
                    })
                    document.getElementById("form-message").style.color = "green";
                    document.getElementById("form-message").innerHTML = `Address successfully added!`;
                }
            })
        }
    })

    const buttons = document.querySelectorAll('#selectableList .selectable');
    buttons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const find = button.id;
    
            chrome.storage.local.get("tags", function (item) {
                let prevTags = item["tags"]
    
                if (prevTags.includes(find)) {
                    console.log("removed");
                    prevTags = prevTags.filter(tag => tag !== find);
                    e.target.style.backgroundColor = '#F2A53F';
                } else {
                    console.log("added");
                    prevTags = [...prevTags, find];
                    e.target.style.backgroundColor = '#f08e0c';
                }
                chrome.storage.local.set({ tags: prevTags }, function() {
                    if (chrome.runtime.lastError) {
                        console.error('Error setting tags:', chrome.runtime.lastError);
                    }
                });
            });
        });
    });
    
})