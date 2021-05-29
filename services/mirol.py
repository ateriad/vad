import json
import requests
from os import environ
from __init__ import redis
from models import Channel
from __init__ import db


def login():
    response = requests.post('https://mirol.ir/api/servers/login', data={
        'username': environ.get('MIROL_USERNAME'),
        'password': environ.get('MIROL_PASSWORD'),
    })

    response = response.json()

    redis.set('mirol:access_token', response['access_token'])

    return response['access_token']


def get_info(cellphone):
    try:
        token = redis.get('mirol:access_token')

        if not token:
            token = login()

        response = requests.post('https://mirol.ir/api/servers/ateriad/get_stream_info?token=' + token, data={
            'phone': cellphone
        })

        return response.json()
    except (requests.exceptions.ConnectionError, requests.exceptions.SSLError, json.decoder.JSONDecodeError) as e:
        print('mirol connection error')
        return {}


def update_mirol_channel(user):
    info = get_info(user.cellphone)

    if 'stream_url' in info and 'hls_link' in info:
        rtmp_url = info['stream_url'] + '/' + info['stream_key']

        channel = Channel.query.filter_by(user_id=user.id, rtmp_url=rtmp_url).first()

        if channel is None:
            channel = Channel(user_id=user.id, title='mirol', rtmp_url=rtmp_url, hls_url=info['hls_link'])
            db.session.add(channel)
            db.session.commit()
