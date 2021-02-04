// Copyright (C) 2020 hashedpotato3@gmail.com
// License: MIT 

const appName = "com.node.open_local"

// on installation of this extension
chrome.runtime.onInstalled.addListener(details => {
    if( details.reason === "install" ){ // on install
        let message  = { cmd: "get-options" }
        chrome.runtime.sendNativeMessage(appName, message, response => {
            console.info("response: "+JSON.stringify(response));
            if (typeof response === "undefined") { // error occur in connecting to host
                chrome.tabs.create({
                    url: chrome.runtime.getURL("install.html"),
                });
                //console.log(chrome.runtime.lastError)
            }
        });
    }
    return;
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.cmd === 'open-local') {
        console.info("request to native host: "+JSON.stringify(message))
        chrome.runtime.sendNativeMessage(appName, message, response => {
            console.info("response: "+JSON.stringify(response));
        });
    }
});
