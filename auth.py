from flask import Blueprint, render_template, redirect, url_for, request, flash, jsonify, make_response
from models import User
from flask_login import login_user, logout_user, login_required, current_user
from __init__ import db
from services.otp import otp_store, otp_check
from services.sms import send_sms
from os import environ
from services.validator import validate

auth = Blueprint('auth', __name__)


@auth.route('/otp/request', methods=['POST'])
def otp_request():
    validate(request, {
        "cellphone": ["string", "cellphone"],
    })

    cellphone = request.form.get('cellphone')
    code = otp_store(cellphone)

    if environ.get('FLASK_ENV') == 'production':
        body = 'کد ورود به تبلیغات مجازی' + '\n' + 'Code: ' + str(code)
        send_sms(cellphone, body)

        return jsonify({
            'message': 'کد ارسال شد',
            'expires_after': 120,
        })
    else:
        return jsonify({
            'message': str(code),
            'expires_after': 120,
        })


@auth.route('/otp', methods=['GET', 'POST'])
def otp():
    if request.method == 'GET':
        if current_user.is_authenticated:
            return redirect(url_for('main.dashboard'))

        return render_template('auth/otp.html')
    else:
        validate(request, {
            "cellphone": ["string", "cellphone"],
        })

        cellphone = request.form.get('cellphone')
        code = request.form.get('otp')

        if otp_check(cellphone, code):
            user = User.query.filter_by(cellphone=cellphone).first()
            if not user:
                user = User(cellphone=cellphone)
                db.session.add(user)
                db.session.commit()

            login_user(user, remember=True)

            return jsonify({
                'redirect': url_for('main.dashboard'),
            })
        else:
            return make_response(jsonify({
                'message': 'کد اشتباه است',
            }), 404)


@auth.route('/sign-out')
@login_required
def sign_out():
    logout_user()
    return redirect(url_for('main.index'))
