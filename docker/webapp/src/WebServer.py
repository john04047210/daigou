# -*- coding: utf-8 -*-

import os

from flask import Flask, request, session
from flask_babelex import Babel
from flask_cors import CORS
from flask_gzip import Gzip
from ocrweb import PocWebapp

import prod

url_prefix = prod.url_prefix
static_url_path = '{}/static'.format(url_prefix) if url_prefix else None

app = Flask(__name__, static_url_path=static_url_path, instance_path=url_prefix)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
app.config['JSONIFY_MIMETYPE'] = 'application/json; charset=utf-8'
app.config['APPLICATION_ROOT'] = url_prefix
app.config['URL_PREFIX'] = url_prefix
app.config['domain'] = prod.domain
CORS(app)
Gzip(app)
PocWebapp(app=app, url_prefix=url_prefix)
babel = Babel(app=app)



@babel.localeselector
def get_locale():
    # if a user is logged in, use the locale from the user settings
    locale = session['babel_locale'] if 'babel_locale' in session else None
    if locale is not None:
        return locale
    matched = request.accept_languages.best_match(['ja', 'en'])
    session['babel_locale'] = matched
    return matched


@babel.timezoneselector
def get_timezone():
    timezone = session['babel_timezone'] if 'babel_timezone' in session else None
    if timezone is not None:
        return timezone


if __name__ == '__main__':
    app.run(host=prod.host_ip, port=prod.web_port)
