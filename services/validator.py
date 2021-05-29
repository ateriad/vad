from flask import abort, jsonify
import re

messages = {
    'string': 'باید متنی باشد',
    'cellphone': 'باید صحیح باشد',
    'rtmp': 'صحیح نیست',
    'hls': 'صحیح نیست',
    'numeric': 'صحیح نیست',
    'required': 'الزامی است',
}

attributes = {
    'cellphone': 'شماره همراه',
    "input_rtmp_url": 'آدرس rtmp ورودی',
    "input_hls_url": 'آدرس hls ورودی',
    "output_rtmp_url": 'آدرس rtmp خروجی',
    "output_hls_url": 'آدرس hls خروجی',
    "ad_path": 'تبلیغ',
    "coordinate_tl_x": 'گوشه بالا چپ',
    "coordinate_tl_y": 'گوشه بالا چپ',
    "coordinate_tr_x": 'گوشه بالا راست',
    "coordinate_tr_y": 'گوشه بالا راست',
    "coordinate_bl_x": 'گوشه پایین چپ',
    "coordinate_bl_y": 'گوشه پایین چپ',
    "coordinate_br_x": 'گوشه پایین راست',
    "coordinate_br_y": 'گوشه پایین راست',
}


def validate(request, rules_dict):
    errors = {}

    for key, rules in rules_dict.items():
        val = request.form.get(key)

        for rule in rules:
            result = eval(rule + "(\"" + val + "\")")

            if result is False:
                name = ''
                if key in attributes:
                    name = attributes[key]

                errors[key] = name + ' ' + messages[rule]
                continue

    if len(errors) > 0:
        abort(422, errors)


def string(value):
    return isinstance(value, str)


def cellphone(value):
    matched = re.match("^09[0-9]{9}$", value)
    return bool(matched)


def rtmp(value):
    return value.startswith('rtmp')


def hls(value):
    return value.startswith('http')


def numeric(value):
    return value.isnumeric()


def required(value):
    return value != '' and value is not None
