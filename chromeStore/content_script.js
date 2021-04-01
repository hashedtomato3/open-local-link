// Copyright (C) 2020  hashedpotato3@gmail.com
// License: MIT 

{
    console.log("loading content_script.js");

    // // recursively find frames and call callback(frame)
    // let forEachFrame = (fr, callback) => {
    //     callback(fr);
    //     fr.contentDocument.querySelectorAll("frame").forEach((frame) => {
    //         forEachFrame(frame, callback);
    //     });
    // }

    // add click event listner to window
    let addClickEventListerToWindow = (w) => {
        //console.log("set lister to: " + w.name)
        w.addEventListener('click', e => {
            //console.log("click frame window " + w.name)
            // check if user event
            // If event is fired by user's operation then isTrusted == true.
            // Chrome 46.0～
            // https://developer.mozilla.org/ja/docs/Web/API/Event/isTrusted
            if (!e.isTrusted) return;
            // if left button click without pressing any key
            if (e.button === 0 && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                let a = e.target.closest('a');
                if (a) {
                    if (a.href) {
                        if (a.href.startsWith('file://')) {
                            console.log("clicked a href: " + a.href)
                            //e.preventDefault();
                            //e.stopPropagation();
                            //e.stopImmediatePropagation();
                            // Catch the error for the extension is reloaded.
                            try {
                                chrome.runtime.sendMessage({
                                    cmd: 'open-local',
                                    url: a.href
                                });
                            } catch (err) {
                                console.log(err)
                            }
                            //return false;
                        }
                    }
                }
            }
        }, {
            passive: true,
            //capture: true,
        });
    }

    // for top window
    addClickEventListerToWindow(window);

    // // for frame windows if exists
    // let frames = document.querySelectorAll("frame") || [];
    // frames.forEach(frame => {
    //     forEachFrame(frame, (fr) => { // for all frames and subframes
    //         fr.addEventListener("load", e => {
    //             console.log("load frame window " + fr.name)
    //             addClickEventListerToWindow(fr.contentWindow);
    //         });
    //     })
    // });
}
