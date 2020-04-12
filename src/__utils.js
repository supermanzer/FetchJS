/*
A poorly named but common place to stick general purpose utility functions.
*/

var Utils = (function () {

    /**
     * Return HTML element that triggered event
     * @param ev - Click event
     * @param tagName - TagName we should search for (string or array)
     * @returns {*|HTMLElement}
     */
    function getEventElement(ev, tagName) {
        let el = ev.target;
        if (typeof tagName == 'string') {
            while (el.tagName !== tagName) {
                el = el.parentElement;
                if (el === null) {
                    el = false;
                    break;
                }
            }
        } else if (typeof tagName == 'object') {
            while (!el.tagName.includes(tagName)) {
                el = el.parentElement;
                if (el === null) {
                    el = false;
                    break;
                }
            }
        }
        return el;
    }
    return {
        getEventElement: getEventElement,
    }
})();
