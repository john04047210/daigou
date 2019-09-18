# -*- coding: utf-8 -*-

from __future__ import absolute_import, print_function

import hashlib
from flask import current_app, redirect, url_for
from flask_login import LoginManager

from . import config
from .cli import db_cli
from .database import db
from .models import User
from .views import blueprint


class PocWebapp(object):
    """POC Webapp extension."""

    def __init__(self, app=None, **kwargs):
        if app:
            self.init_app(app, **kwargs)

    def init_app(self, app, **kwargs):
        self.init_config(app)
        db.init_app(app)
        app.cli.add_command(db_cli)
        context = kwargs['url_prefix'] if 'url_prefix' in kwargs else ''
        app.register_blueprint(blueprint, url_prefix=context)
        self.init_login_manager(app)
        app.extensions['poc-index'] = self

    def init_config(self, app):
        app.config['SQLALCHEMY_DATABASE_URI'] = config.POC_SQLALCHEMY_DATABASE_URI
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

    def init_login_manager(self, app):
        login_manager = LoginManager(app=app)
        login_manager.login_view = '/{domain}/login'.format(app.config['domain'])

        @login_manager.user_loader
        def load_user(userid):
            if userid:
                user = User.get_user_by_uid(userid)
                return user
            return None

        @login_manager.request_loader
        def request_loader(request):
            current_app.logger.debug('request_loader method: {0}'.format(request.method))
            if request and request.method == 'POST':
                post_data = request.form
                email = post_data.get('email') if 'email' in post_data else None
                pwd = post_data.get('password') if 'password' in post_data else None
                if email and pwd:
                    current_app.logger.debug('post_data pwd: {0}'.format(pwd))
                    user = User.get_user_by_email(email)
                    if user:
                        hl = hashlib.md5()
                        hl.update(pwd.encode(encoding='utf-8'))
                        input_pwd = hl.hexdigest()
                        current_app.logger.debug('post_data pwd: {0}'.format(input_pwd))
                        hl = hashlib.md5()
                        hl.update(input_pwd.encode(encoding='utf-8'))
                        input_pwd = hl.hexdigest()
                        current_app.logger.debug('post_data pwd: {0}'.format(input_pwd))
                        if user.password == input_pwd:
                            return user
            return None

        @login_manager.unauthorized_handler
        def unauthorized_handler_user():
            return redirect(url_for('poc_index.login'))
