from flask_login import UserMixin
from __init__ import db
from datetime import datetime


class User(UserMixin, db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    cellphone = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=True)
    password = db.Column(db.String(100), nullable=True)
    name = db.Column(db.String(1000), nullable=True)
    surname = db.Column(db.String(1000), nullable=True)
    image = db.Column(db.String(1000), nullable=True)
    created_at = db.Column(
        db.DateTime,
        default=datetime.now,
        unique=False,
        nullable=False,
        index=True
    )
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        unique=False,
        nullable=False,
        index=True
    )


class Stream(UserMixin, db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('user.id'), nullable=False)
    input_rtmp = db.Column(db.String(1000), nullable=False)
    input_hls = db.Column(db.String(1000), nullable=False)
    output_rtmp = db.Column(db.String(1000), nullable=False)
    output_hls = db.Column(db.String(1000), nullable=False)
    ad = db.Column(db.String(1000), nullable=False)
    coordinate = db.Column(db.TEXT, nullable=False)
    status = db.Column(db.Integer, default=0)
    created_at = db.Column(
        db.DateTime,
        default=datetime.now,
        unique=False,
        nullable=False,
        index=True
    )
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        unique=False,
        nullable=False,
        index=True
    )


class Channel(UserMixin, db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    rtmp_url = db.Column(db.String(1000), nullable=False)
    hls_url = db.Column(db.String(1000), nullable=False)
    created_at = db.Column(
        db.DateTime,
        default=datetime.now,
        unique=False,
        nullable=False,
        index=True
    )
    updated_at = db.Column(
        db.DateTime,
        default=datetime.now,
        onupdate=datetime.now,
        unique=False,
        nullable=False,
        index=True
    )
