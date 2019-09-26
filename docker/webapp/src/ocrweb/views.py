# -*- coding: utf-8 -*-

import hashlib

from flask import (Blueprint, current_app, jsonify, redirect, request, render_template, session, url_for)
from flask_login import current_user, login_user, logout_user, login_required
from .api import PocApi
from .models import User

blueprint = Blueprint(
    'poc_index',
    __name__,
    template_folder='templates',
    static_folder='static',
    url_prefix=''
)


def _get_language():
    babel_language = session['babel_locale'] if 'babel_locale' in session else None
    if not babel_language:
        babel_language = request.accept_languages.best_match(['ja', 'en'], 'en')
        session['babel_locale'] = babel_language
    return babel_language


@blueprint.route('/lang/<string:language>', methods=['GET'])
@login_required
def set_locale(language='en'):
    session['babel_locale'] = language
    return jsonify({'code': 0, 'msg': 'success'})


@blueprint.route('/index')
@login_required
def index():
    return jsonify({'code': 0, 'msg': 'success', 'data': {
        'is_admin': current_user.is_admin, 'is_active': current_user.is_active}})


@blueprint.route('/render/buyers', methods=['GET'])
@blueprint.route('/render/buyers<int:buyer_id>', methods=['GET'])
@login_required
def render_devices_list(buyer_id=None):
    devices = PocApi.get_all_buyer()
    babel_language = _get_language()
    return render_template(
        'devices.html',
        babel_language=babel_language,
        prefix=current_app.config['URL_PREFIX'],
        devices=devices
    )


@blueprint.route('/login', methods=['GET', 'POST'])
def login():
    err_msg = None
    if request.method == 'POST':
        post_data = request.form
        if post_data:
            email = post_data.get('email') if 'email' in post_data else None
            pwd = post_data.get('password') if 'password' in post_data else None
            remember = post_data.get('remember') if 'remember' in post_data else False
            current_app.logger.debug('view post_data pwd: {0}'.format(pwd))
            if email and pwd:
                user = User.get_user_by_email(email)
                if user:
                    hl = hashlib.md5()
                    hl.update(pwd.encode(encoding='utf-8'))
                    input_password = hl.hexdigest()
                    hl = hashlib.md5()
                    hl.update(input_password.encode(encoding='utf-8'))
                    input_password = hl.hexdigest()
                    if user.password == input_password:
                        login_user(user, remember=remember)
                        next_url = request.args.get('next')
                        return redirect(next_url or url_for('poc_index.index'))
        err_msg = 'email or password error'
    return render_template(
        'page_login.html',
        prefix=current_app.config['URL_PREFIX'],
        errMsg=err_msg
    )


@blueprint.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('poc_index.login'))


@blueprint.route('/login_test')
@login_required
def login_test():
    return jsonify({'code': 0, 'msg': 'success', 'data': {
        'is_admin': current_user.is_admin, 'is_active': current_user.is_active}})


@blueprint.app_errorhandler(404)
@login_required
def page_not_found(ex):
    babel_language = _get_language()
    return render_template(
        'page_404.html',
        babel_language=babel_language,
        prefix=current_app.config['URL_PREFIX'],
    ), 404
