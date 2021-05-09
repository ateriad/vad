from flask import Blueprint, render_template, request, jsonify, make_response, url_for
from flask_login import login_required, current_user
from __init__ import create_app, db
from werkzeug.utils import secure_filename
from services.processor import va
import os
import time

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/dashboard/profile')
@login_required
def profile():
    return render_template('dashboard/profile.html', current_user=current_user)


@main.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard/index.html', current_user=current_user)


@main.route('/dashboard/playout')
@login_required
def playout():
    return render_template('dashboard/playout.html', current_user=current_user)


@main.route('/dashboard/streams', methods=['POST'])
@login_required
def stream_store():
    if request.method == 'POST':
        output_url = request.form.get('output_stream_url')
        input_url = request.form.get('input_stream_url')
        ad_path = request.form.get('ad_path')
        tl = [request.form.get('coordinate_tl_x'), request.form.get('coordinate_tl_y'), ]
        tr = [request.form.get('coordinate_tr_x'), request.form.get('coordinate_tr_y'), ]
        bl = [request.form.get('coordinate_bl_x'), request.form.get('coordinate_bl_y'), ]
        br = [request.form.get('coordinate_br_x'), request.form.get('coordinate_br_y'), ]

        va(input_url, output_url, ad_path, tl, tr, bl, br);

        return jsonify({
            'message': 'success',
        })


@login_required
@main.route('/upload/file', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        if 'file' not in request.files:
            return make_response(jsonify({
                'message': 'No file part',
            }), 423)

        if file.filename == '':
            return make_response(jsonify({
                'message': 'filename is empty',
            }), 423)

        if file:
            filename = secure_filename(str(time.time()) + file.filename)
            directory = app.config['UPLOAD_FOLDER'] + '/' + str(current_user.id)

            if not os.path.exists(directory):
                os.makedirs(directory)

            file.save(os.path.join(directory, filename))

            return jsonify({
                'path': filename,
            })


app = create_app()
if __name__ == '__main__':
    db.create_all(app=create_app())
    app.run(debug=True, host='0.0.0.0')
