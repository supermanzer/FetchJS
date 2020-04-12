# -*- coding: utf-8 -*-
"""
Flask REST API

This file defines a simple API  that can be used to test the functionality of the Javascript code in this repo
"""
import flask
from flask_cors import CORS
from flask import request, jsonify


# Instantiate the app and set the DEBUG configuration to True
app = flask.Flask(__name__)
CORS(app)
app.config['DEBUG'] = True

# Define some endpoints
@app.route('/', methods=['GET'])
def home():
    # Pretty Basic endpoint    
    msg = '<h1>Welcome to your Test Page!</h1>'
    is_valid = True
    response = jsonify({'html': msg, 'is_valid': is_valid})
    return response


# Let's get a little more impressive
@app.route('/cool-things-i-like', methods=['GET'])
def cool_things():
    # first let's define the cool things
    nifty_stuff = [
        {
            'id': 0,
            'topic': 'Python',
            'why': """Because it's so fun and easy to write, I can make so many things with it."""
        }, {
            'id': 1,
            'topic': 'Relational Databases',
            'why': """
                Being able to build data models and efficiently relate information is just pretty badass.
            """
        }, {
            'id': 2,
            'topic': 'JavaScript',
            'why':  "Even though different implementations across browsers can be a headache, you can make some cool stuff with JS."
        }
    ]
    # We wrap this in a try...except exception handler in case this weird ass code breaks - our API should still return a result
    try:
    # Let's check to see if an ID pramater was passed in the URL 
        # (ex. /cool-things-i-like?id=1)
        if 'id' in request.args:
            id = int(request.args['id'])
        else:
            id = False

        if id:
            result = [nifty_stuff[id]]; # <- wrapping the result in a list to keep it iterable, you'll see why
        else:
            result = nifty_stuff

        # Using some f-strings and list text methods to build an unordered list of nifty things
        html = '</li><li>'.join([f"<h1>{ns['topic']}</h1><p>{ns['why']}</p>" for ns in nifty_stuff]) 
        html = f"<ul><li>{html}</li></ul>"
        
        response = {'html': html, 'is_valid': True}
    except Exception as e:
        response = {'error': f"<h2>Error occured: {str(e)}</h2>", 'is_valid': False}
        
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run()