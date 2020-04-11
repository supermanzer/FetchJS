/*
  src/fetch.js
  
  This file defines the functions used to make the AJAX calls and process responses
   THESE METHODS ASSUME THE USE OF ELEMENT DATASETS IN ORDER TO IDENTIFY URLS TO MAKE REQUESTS AND THE ELEMENTS INTO WHICH HTML RETURNED IS TO BE RENDERED.
*/

 const AJAX = (() => {
     // DEFINE UNTILITY FUNCTIONS - NOT FOR EXPORTING AS PART OF AJAX OBJECT

     /**
      * Return the element whether it was originally passed in or a CSS selector string was passed in
      * @param {Element|string} selector Either the element we wish to interact with, or a CSS selector string
      */
     const getElem = (selector) => {
        let el = False;
        if (typeof selector == 'string') {
            el = document.querySelector(selector);
        } else {
            el = selector
        }
        return el;
     }
     
     // Status function
     const processStatus = (response) => {
         if (response.status === 200 || response.status == 0) {
             return Promise.resolve(response);
         } else {
             return Promise.reject(new Error('Error when fetching resource'));
         }
     }

     // Response parsing functions
     /**
      * Function to return blob from response
      * @param {Response} response Response object returned from FetchAPI
      */
     const parseBlob = (response) => {
        return response.blob();
     }

     /**
      * Function to return JSON from a Fetch resposne object
      * @param {response} response Response object returned form FetchAPI
      */
     const parseJSON = (response) => {
         return response.json();
     }

     // mapping functions to handy object keys
     const parser = {
         blob: parseBlob,
         json: parseJSON
     }

     /**
      * Return the data from the FetchAPI, depending on the type expected
      * @param {Response} response Response ojbect returned by FetchAPI
      * @param {string} type The type of data expected
      */
     const responseParse = (response, type='json') => {
         return parser[type](response)
     }


     /**
      * A function that allows for varying responses based on the status code of the Response object
      * @param {Response} response Response object returned by FetchAPI
      * @param {Element|string} selector The Element or string that is the target of this action <- INCLUDED TO PROVIDE USER MESSAGING
      */
     const statusCheck = (response, selector) => {
         let elem = getElem(selector);
         if (!response.ok) {
             switch (response.status){
                case 500:
                     console.log("Server error") // <- DO MORE NIFTY STUFF HERE LIKE CUSTOM MESSAGES TO USER
                     break;
                case 403:
                    console.log("You're not allowed to do that") // <- ALSO A GOOD SPOT FOR NIFTY STUFF
                    break;
                default:
                    Promise.reject(new Error('Loading failed'));
             }
             
         } else {
             return response;
         }
     }

     /**
      * A function to check validity of JSON data returned and return the HTML contained therein. 
      * THIS ASSUMES JSON OBJECTS RETURNED BY SERVER HAVE THE FOLLOWING STRUCTURE {html: <html code to be rendered>, error: <html code about error>, is_valid:True|False}
      * @param {Object} json_obj The JSON object parsed from a Response
      */
     const returnHTML = (json_obj) => {
         if (json_obj.is_valid && json_obj.hasOwnProperty('html')) {
             html = json_obj.html;
         } else if (!json_obj.is_valid && json_obj.hasOwnProperty('error')) {
             html = json_obj.error;
         } else {
             return json_obj;
         }
         return html;
     }

     /**
      * This function loads html into a single element.
      * @param {string} html The html code to be written into the element definted by the selector
      * @param {Element|String} selector Either the selector that is used to find an element or the elemnet itself into which the HTML will be inserted
      */
    const loadSingleElement = (html, selector) => {
        let el = getElem(selector);

        if (el) {
            el.innerHTML = html;
            const loadEvent = new CustomEvent('AJAXLoaded')
            document.dispatchEvent(loadEvent);
        }
    }

    /**
     * A function to examine the DOMStringMap dataset of the element triggering this call.
     * @param {Element} elem The element triggering this AJAX call
     * @param {Boolean} check_target Whether or not we assign the calling element as the target, if none is defined
     */
    const checkDataset = (elem, check_target=true) => {
        const dataset = elem.dataset;
        if (!dataset.url && !dataset.target) {
            console.error(`This dataset is missing necessary parameters: ${dataset}`);
        } else if (check_target && !dataset.target) {
            dataset.target = `.${el.className.replace(' ', '.')}`
        }
        return dataset
    }

    /**
     * This function perofrms the GET Request and then routes the Response objet through mulitple processing steps
     * @param {string} url The URL used for the GET request
     * @param {string} dataType The type of data we expect returned
     * @param {Element|string} selector The elment into which any returned HTML will be loaded
     */
    const checkAndParse = (url, dataType='json', selector=false) => {
        return fetch(url).then((response) => statusCheck(response, selector))
        .then((response) => responseParse(response, dataType));
    }


    // THE MAIN CALLING FUNCTIONS 
    /**
     * The first in a series of functions to make GET requests and process responses
     * @param {string} url The URL used in the GET reeqeust
     * @param {Element|string} selector Element (or CSS selector) that is the target of the response
     * @param {string} dataType The type of data expected from the server
     */
    const getLoad = (url, selector, dataType='json') => {
        return checkAndParse(url, dataType, selector)
        .then((json) => {
            html = returnHTML(json);
            loadSingleElement(html, selector);
        })
    }

    /**
     * A version of getLoad that parses the DOMStringMap for the URl and Selector parameters
     * @param {Element|string} el The element (or CSS selector) that triggered the Fetch call
     */
    const getLoadElement = (el) => {
        const dset = checkDataset(el);
        return getLoad(dset.url, dset.target)
    }

    /**
     * Perform AJAX calls and loading operations over an array of elements
     * I like to use this as part of an initialization process for an index.html type of page
     * @param {Array} array An array of either Elements or CSS Element selectors to be run through the getLoadElement process
     */
    const getLoadElements = (array) => {
        const proms = [];
        array.forEach(element => {
            let elem = getElem(element);
            let resp = getLoadElement(elem);
            proms.push(resp);
        });
        return proms;
    }

    return {
        getLoad: getLoad,
        getLoadElement: getLoadElement,
        getLoadElements: getLoadElements,
    }
 })();

 module.exports = [AJAX]; // YOU KNOW, IN CASE YOU WANT TO IMPORT THIS SOMEWHERE