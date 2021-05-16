from flask import Blueprint, jsonify

error = Blueprint('error', __name__)


@error.app_errorhandler(422)
def validation_error(e):
    return jsonify({"errors": e.description}), 422
