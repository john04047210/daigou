# -*- coding: utf-8 -*-

import hashlib

from flask import (Blueprint, current_app, jsonify, redirect, request, render_template, session, url_for,
                   make_response, send_file)
from flask_login import current_user, login_user, logout_user, login_required
from .api import PocApi
from .models import User
from .utils import Utils

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
@login_required
def render_devices_list():
    buyers = PocApi.get_all_buyer()
    babel_language = _get_language()
    return render_template(
        'devices.html',
        babel_language=babel_language,
        prefix=current_app.config['URL_PREFIX'],
        buyers=buyers
    )


@blueprint.route('/api/buyer', methods=['POST'])
@login_required
def api_new_buyer():
    post_data = request.get_json()
    buyer = PocApi.new_buyer(**post_data)
    return jsonify({
        'code': 0,
        'msg': 'success',
        'data': buyer
    })


@blueprint.route('/api/buyer/<int:buyer_id>', methods=['PUT'])
@login_required
def api_upt_buyer(buyer_id=None):
    post_data = request.get_json()
    buyer = PocApi.upt_buyer(buyer_id, **post_data)
    return jsonify({
        'code': 0,
        'msg': 'success',
        'data': buyer
    })


@blueprint.route('/api/buyer/<int:buyer_id>', methods=['DELETE'])
@login_required
def api_del_buyer(buyer_id=None):
    PocApi.del_buyer(buyer_id)
    return jsonify({
        'code': 0,
        'msg': 'success'
    })


@blueprint.route('/api/download/orders', methods=['GET'])
@login_required
def download_orders_list():
    stroke_id = request.args.get('stroke_id', default=None)
    if stroke_id:
        stroke_name = PocApi.get_stroke_name(stroke_id)
        books = PocApi.get_order_list_for_download(stroke_id)
        if books:
            zip_filepath, zip_filename = Utils.create_xlsx(stroke_name=stroke_name, orders=books)
            mime_type = 'application/zip'
            responses = make_response(send_file(zip_filepath, mime_type, as_attachment=True))
            responses.headers['Content-Type'] = mime_type
            responses.headers['Content-Disposition'] = 'attachment; filename={}'.format(zip_filename)
            responses.headers['Set-Cookie'] = 'fileDownload=true: path=/'
            responses.headers['Cache-control'] = 'no-cache'
            return responses

    return jsonify({
        'code': 1,
        'msg': 'param error'
    })


@blueprint.route('/render/orders', methods=['GET'])
@login_required
def render_orders_list():
    books = []
    stroke_id = request.args.get('stroke_id', default=None)
    strokes = PocApi.get_stroke_list()
    if stroke_id is None and strokes:
        stroke_id = strokes[0]['stroke_id']
    if stroke_id:
        books = PocApi.get_order_list(stroke_id)
    babel_language = _get_language()
    return render_template(
        'books.html',
        babel_language=babel_language,
        prefix=current_app.config['URL_PREFIX'],
        strokes=strokes,
        books=books
    )


@blueprint.route('/api/stroke', methods=['POST'])
@login_required
def api_new_stroke():
    post_data = request.get_json()
    stroke = PocApi.new_stroke(post_data['name'])
    return jsonify({
        'code': 0,
        'msg': 'success',
        'data': stroke
    })


@blueprint.route('/api/order', methods=['POST'])
@login_required
def api_new_order():
    post_data = request.get_json()
    stroke = PocApi.new_order(post_data['stroke_id'], post_data['book_name'], post_data['book_goods'])
    return jsonify({
        'code': 0,
        'msg': 'success',
        'data': stroke
    })


@blueprint.route('/api/order/<int:order_id>', methods=['PUT'])
@login_required
def api_upt_order(order_id=None):
    post_data = request.get_json()
    address = post_data['address'] if 'address' in post_data else None
    stroke = PocApi.upt_order(order_id, post_data['book_name'], post_data['book_goods'], address=address)
    return jsonify({
        'code': 0,
        'msg': 'success',
        'data': stroke
    })


@blueprint.route('/api/order/<int:order_id>', methods=['DELETE'])
@login_required
def api_del_order(order_id=None):
    PocApi.del_order(order_id)
    return jsonify({
        'code': 0,
        'msg': 'success'
    })


@blueprint.route('/api/order/<int:order_id>/address/<int:address_id>', methods=['GET'])
@login_required
def api_upt_order_address(order_id=None, address_id=None):
    stroke = PocApi.upt_order_address(order_id, address_id)
    return jsonify({
        'code': 0,
        'msg': 'success',
        'data': stroke
    })


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
                        return redirect(next_url or url_for('poc_index.render_orders_list'))
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
