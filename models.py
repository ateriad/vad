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
