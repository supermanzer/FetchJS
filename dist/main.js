"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
A poorly named but common place to stick general purpose utility functions.
*/
var Utils = function () {
  /**
   * Return HTML element that triggered event
   * @param ev - Click event
   * @param tagName - TagName we should search for (string or array)
   * @returns {*|HTMLElement}
   */
  function getEventElement(ev, tagName) {
    var el = ev.target;

    if (typeof tagName == 'string') {
      while (el.tagName !== tagName) {
        el = el.parentElement;

        if (el === null) {
          el = false;
          break;
        }
      }
    } else if (_typeof(tagName) == 'object') {
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
    getEventElement: getEventElement
  };
}();
"use strict";

/*
  src/fetch.js
  
  This file defines the functions used to make the AJAX calls and process responses
   THESE METHODS ASSUME THE USE OF ELEMENT DATASETS IN ORDER TO IDENTIFY URLS TO MAKE REQUESTS AND THE ELEMENTS INTO WHICH HTML RETURNED IS TO BE RENDERED.
*/
var AJAX = function () {
  // DEFINE UNTILITY FUNCTIONS - NOT FOR EXPORTING AS PART OF AJAX OBJECT

  /**
   * Return the element whether it was originally passed in or a CSS selector string was passed in
   * @param {Element|string} selector Either the element we wish to interact with, or a CSS selector string
   */
  var getElem = function getElem(selector) {
    var el = false;

    if (typeof selector == 'string') {
      el = document.querySelector(selector);
    } else {
      el = selector;
    }

    return el;
  }; // Status function


  var processStatus = function processStatus(response) {
    if (response.status === 200 || response.status == 0) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error('Error when fetching resource'));
    }
  }; // Response parsing functions

  /**
   * Function to return blob from response
   * @param {Response} response Response object returned from FetchAPI
   */


  var parseBlob = function parseBlob(response) {
    return response.blob();
  };
  /**
   * Function to return JSON from a Fetch resposne object
   * @param {response} response Response object returned form FetchAPI
   */


  var parseJSON = function parseJSON(response) {
    return response.json();
  }; // mapping functions to handy object keys


  var parser = {
    blob: parseBlob,
    json: parseJSON
  };
  /**
   * Return the data from the FetchAPI, depending on the type expected
   * @param {Response} response Response ojbect returned by FetchAPI
   * @param {string} type The type of data expected
   */

  var responseParse = function responseParse(response) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'json';
    return parser[type](response);
  };
  /**
   * A function that allows for varying responses based on the status code of the Response object
   * @param {Response} response Response object returned by FetchAPI
   * @param {Element|string} selector The Element or string that is the target of this action <- INCLUDED TO PROVIDE USER MESSAGING
   */


  var statusCheck = function statusCheck(response, selector) {
    var elem = getElem(selector);

    if (!response.ok) {
      switch (response.status) {
        case 500:
          console.log("Server error"); // <- DO MORE NIFTY STUFF HERE LIKE CUSTOM MESSAGES TO USER

          break;

        case 403:
          console.log("You're not allowed to do that"); // <- ALSO A GOOD SPOT FOR NIFTY STUFF

          break;

        case 404:
          console.log("I can't find that....sorry");
          break;

        default:
          Promise.reject(new Error('Loading failed'));
      }
    } else {
      return response;
    }
  };
  /**
   * A function to check validity of JSON data returned and return the HTML contained therein. 
   * THIS ASSUMES JSON OBJECTS RETURNED BY SERVER HAVE THE FOLLOWING STRUCTURE {html: <html code to be rendered>, error: <html code about error>, is_valid:True|False}
   * @param {Object} json_obj The JSON object parsed from a Response
   */


  var returnHTML = function returnHTML(json_obj) {
    var html = '';

    if (json_obj.is_valid && json_obj.hasOwnProperty('html')) {
      html = json_obj.html;
    } else if (!json_obj.is_valid && json_obj.hasOwnProperty('error')) {
      html = json_obj.error;
    } else {
      return json_obj;
    }

    return html;
  };
  /**
   * This function loads html into a single element.
   * @param {string} html The html code to be written into the element definted by the selector
   * @param {Element|String} selector Either the selector that is used to find an element or the elemnet itself into which the HTML will be inserted
   */


  var loadSingleElement = function loadSingleElement(html, selector) {
    var el = getElem(selector);

    if (el) {
      el.innerHTML = html;
      var loadEvent = new CustomEvent('AJAXLoaded');
      document.dispatchEvent(loadEvent);
    }
  };
  /**
   * A function to examine the DOMStringMap dataset of the element triggering this call.
   * @param {Element} elem The element triggering this AJAX call
   * @param {Boolean} check_target Whether or not we assign the calling element as the target, if none is defined
   */


  var checkDataset = function checkDataset(elem) {
    var check_target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    elem = getElem(elem);
    var dataset = elem.dataset;

    if (!dataset.url && !dataset.target) {
      console.error("This dataset is missing necessary parameters: ".concat(dataset));
    } else if (check_target && !dataset.target) {
      dataset.target = ".".concat(elem.className.split(' ').join('.'));
    }

    return dataset;
  };
  /**
   * This function perofrms the GET Request and then routes the Response objet through mulitple processing steps
   * @param {string} url The URL used for the GET request
   * @param {string} dataType The type of data we expect returned
   * @param {Element|string} selector The elment into which any returned HTML will be loaded
   */


  var checkAndParse = function checkAndParse(url) {
    var dataType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'json';
    var selector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return fetch(url).then(function (response) {
      return statusCheck(response, selector);
    }).then(function (response) {
      return responseParse(response, dataType);
    });
  }; // THE MAIN CALLING FUNCTIONS 

  /**
   * The first in a series of functions to make GET requests and process responses
   * @param {string} url The URL used in the GET reeqeust
   * @param {Element|string} selector Element (or CSS selector) that is the target of the response
   * @param {string} dataType The type of data expected from the server
   */


  var getLoad = function getLoad(url, selector) {
    var dataType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'json';
    return checkAndParse(url, dataType, selector).then(function (json) {
      var html = returnHTML(json);
      loadSingleElement(html, selector);
    });
  };
  /**
   * A version of getLoad that parses the DOMStringMap for the URl and Selector parameters
   * @param {Element|string} el The element (or CSS selector) that triggered the Fetch call
   */


  var getLoadElement = function getLoadElement(el) {
    var dset = checkDataset(el);
    return getLoad(dset.url, dset.target);
  };
  /**
   * Perform AJAX calls and loading operations over an array of elements
   * I like to use this as part of an initialization process for an index.html type of page
   * @param {Array} array An array of either Elements or CSS Element selectors to be run through the getLoadElement process
   */


  var getLoadElements = function getLoadElements(array) {
    var proms = [];
    array.forEach(function (element) {
      var elem = getElem(element);
      var resp = getLoadElement(elem);
      proms.push(resp);
    });
    return proms;
  };

  return {
    getLoad: getLoad,
    getLoadElement: getLoadElement,
    getLoadElements: getLoadElements
  };
}();
"use strict";

/*
   src/bind.js
  
  This defines global event listeners that serve to bind custom AJAX actions to document events.
  ASSUMPTIONS - Anchor elements are the only general purpose triggers for these actions 
  If the above is not true, modify code accordingly

  CURRENTLY ONLY DEFINE ONE CSS CLASS BINDING BUT THIS CAN BE DRAMATICALLY EXPANDED 
 */
var Binder = function () {
  var selectors = {
    '.js-load-page': AJAX.getLoadElement
  };

  var bindActions = function bindActions() {
    document.addEventListener('click', function (event) {
      var elem = Utils.getEventElement(event, 'A'); // <- this is to deal with things like icons or p tags on top of Anchor elements

      if (elem) {
        var elClass = Object.keys(selectors).find(function (k) {
          return elem.matches(k);
        });
        selectors[elClass](elem);
      }
    });
  };

  return {
    bindActions: bindActions
  };
}();