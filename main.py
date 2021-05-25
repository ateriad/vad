import os
import time
import json
from flask import Blueprint, render_template, request, jsonify, make_response, url_for
from flask_login import login_required, current_user
from __init__ import create_app, db
from werkzeug.utils import secure_filename
from models import Stream, Channel
from services.processor import va
from services.validator import validate
from sqlalchemy import desc

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
    stream = Stream.query.filter_by(user_id=current_user.id).order_by(desc('updated_at')).first()
    channels = Channel.query.filter_by(user_id=current_user.id).order_by(desc('updated_at')).all()

    coordinate = {}
    if stream is not None:
        coordinate = json.loads(stream.coordinate)

    return render_template('dashboard/playout.html', current_user=current_user, stream=stream, coordinate=coordinate,
                           channels=channels)


@main.route('/dashboard/streams', methods=['POST'])
@login_required
def stream_store():
    if request.method == 'POST':
        validate(request, {
            "input_rtmp_url": ["required", "rtmp"],
            "input_hls_url": ["required", "hls"],
            "output_rtmp_url": ["required", "rtmp"],
            "output_hls_url": ["required", "hls"],
            "ad_path": ["required", "string"],
            "coordinate_tl_x": ["required", "numeric"],
            "coordinate_tl_y": ["required", "numeric"],
            "coordinate_tr_x": ["required", "numeric"],
            "coordinate_tr_y": ["required", "numeric"],
            "coordinate_bl_x": ["required", "numeric"],
            "coordinate_bl_y": ["required", "numeric"],
            "coordinate_br_x": ["required", "numeric"],
            "coordinate_br_y": ["required", "numeric"],
        })

        input_rtmp = request.form.get('input_rtmp_url')
        input_hls = request.form.get('input_hls_url')
        output_rtmp = request.form.get('output_rtmp_url')
        output_hls = request.form.get('output_hls_url')
        ad_path = request.form.get('ad_path')

        old_path = app.config['UPLOAD_FOLDER'] + '/temp/' + ad_path
        if os.path.isfile(old_path):
            new_directory = app.config['UPLOAD_FOLDER'] + '/' + str(current_user.id)
            if not os.path.exists(new_directory):
                os.makedirs(new_directory)

            os.rename(old_path, new_directory + '/' + ad_path)

            ad_path = str(current_user.id) + '/' + ad_path

        tl = [request.form.get('coordinate_tl_x'), request.form.get('coordinate_tl_y'), ]
        tr = [request.form.get('coordinate_tr_x'), request.form.get('coordinate_tr_y'), ]
        bl = [request.form.get('coordinate_bl_x'), request.form.get('coordinate_bl_y'), ]
        br = [request.form.get('coordinate_br_x'), request.form.get('coordinate_br_y'), ]

        coordinate = {
            "tl": tl,
            "tr": tr,
            "bl": bl,
            "br": br,
        }

        stream = Stream(user_id=current_user.id,
                        input_rtmp=input_rtmp, input_hls=input_hls, output_rtmp=output_rtmp, output_hls=output_hls,
                        ad=ad_path, coordinate=json.dumps(coordinate))
        db.session.add(stream)
        db.session.commit()

        va(input_rtmp, output_rtmp, ad_path, tl, tr, bl, br);

        return jsonify({
            'message': 'success',
        })


@main.route('/dashboard/settings')
@login_required
def settings():
    channels = Channel.query.filter_by(user_id=current_user.id).order_by(desc('updated_at')).all()

    return render_template('dashboard/settings.html', current_user=current_user, channels=channels)


@main.route('/dashboard/channels', methods=['POST'])
@login_required
def channel_store():
    if request.method == 'POST':
        validate(request, {
            "title": ["required", "string"],
            "rtmp_url": ["required", "rtmp"],
            "hls_url": ["required", "hls"],
        })

        title = request.form.get('title')
        rtmp_url = request.form.get('rtmp_url')
        hls_url = request.form.get('hls_url')

        channel = Channel(user_id=current_user.id, title=title, rtmp_url=rtmp_url, hls_url=hls_url)
        db.session.add(channel)
        db.session.commit()

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
            directory = app.config['UPLOAD_FOLDER'] + '/temp'

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
