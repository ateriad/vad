from random import randint
from __init__ import redis


def otp_store(cellphone):
    code = randint(111111, 999999)
    redis.set('otp:key_' + cellphone, code)
    return code


def otp_check(cellphone, code):
    return redis.get('otp:key_' + cellphone) == code
