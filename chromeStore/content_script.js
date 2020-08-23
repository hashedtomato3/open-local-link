// Copyright (C) 2020  hashedpotato3@gmail.com
// License: MIT 

window.addEventListener('click', e => {
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
                    console.log("clicked a href: "+a.href)
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    // Catch the error for the extension is reloaded.
                    try {
                        chrome.runtime.sendMessage({
                            cmd: 'open-local',
                            url: a.href
                        });
                    } catch (err) {
                        console.log(err)
                    }
                    return false;
                }
            }
        }
    }
}, {
    capture: true,
});
