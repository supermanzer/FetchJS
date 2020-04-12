/*
   src/bind.js
  
  This defines global event listeners that serve to bind custom AJAX actions to document events.
  ASSUMPTIONS - Anchor elements are the only general purpose triggers for these actions 
  If the above is not true, modify code accordingly

  CURRENTLY ONLY DEFINE ONE CSS CLASS BINDING BUT THIS CAN BE DRAMATICALLY EXPANDED 
 */

 var Binder = function() {
    const selectors = {
        '.js-load-page': AJAX.getLoadElement,
    }
    
    const bindActions = () => {
        document.addEventListener('click', event => {
            const elem = Utils.getEventElement(event, 'A'); // <- this is to deal with things like icons or p tags on top of Anchor elements
            if (elem) {
                const elClass = Object.keys(selectors).find(k => elem.matches(k));
                selectors[elClass](elem);
            } 
        });
    }
    return {
        bindActions: bindActions
    }
 }();