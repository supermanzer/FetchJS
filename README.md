# FetchJS README
#### A JavaScript module for providing simple AJAX functionality, written in vanilla JS and using the Fetch API
*I couldn't think of a better name, please forgive me.  I'm not much of a JS dev*

I have been building internal business applications using Django for years now and after getting used to, and frustrated with, JQuery and other JavaScript packages I decided to write my own using pure vanilla JS.  I had recently been using a few different front-end style frameworks (Bootstrap/MaterializeCSS) for rapid visual styling and interactivity.  I liked how you could instantly adjust the style and behavior of your HTML by simply applying specific class names and so I've taken that approach here.  I make use of the Fetch API as it requires no additional dependencies except that people don't use ridiculously outdated web browsers.  I designed this to work with element data attributes as I liked the interface and it seemed a good way to avoid side-effects.  Also I had gotten used to how MaterialzieCSS uses data attributes like `data-tooltip`.

**This may be a very bad implementation and I might be re-inventing multiple wheels here.**

I am sharing this code for multiple reasons but this was never intended to be something polished and a replacement for the myriad of well thought out packages that exist.  I'm simple hoping 
 * To make it easier to import into later projects (if needed)
 * To share with people who have the same need/use case
 * Possibly to get some tips on how to write better JavaScript

## Trying it Out

You can pull down the compiled files in the `dist/` directory (`main.js` unminified and `main.min.js` minified versions). The individual component files are in the `src/` directory.  Feel free to open up and re-write.  The intent of the JavaScript files here are that they will be modified to suit each individual's needs.  I included one class binding (`js-load-page`) as the most generic.  I have made liberal use of modals in my own work (`js-load-modal`) but each front end framework implements modals in their own fashion so that felt a bit more specialized.

You might be wondering
> Hey if this is a JavaScript repo what is that api.py file doing here?

  1. Don't judge me, Python is awesome!
  2. I wanted to provide a sample back-end to interact with

The api.py spins up a simple [Flask](https://flask.palletsprojects.com/en/1.1.x/) API that the `index.html` will attempt to contact.  You will need to have python and pip installed for this to work (try `python --verison` and `pip --version`, if you get an output you're good to go).  You are going to want to follow the next few steps in a terminal.

* Run `pip install -r requirements.txt` to install Flask and Flask_CORS (getting around CORS issues)
* Run `python api.py` to start the Flask API
* Start a local web server for `index.html` (as a Python fan I usually run `python - http.server` to spin up a simple server running at `localhost:8000`).

I invite any and all curious and helpful comments/issues.  If I've written crappy JavaScript and you want to sahre some tips on how to do it better I'd appreciate the help.

 