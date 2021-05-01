from flask import Blueprint, render_template, flash
from flask_login import login_required, current_user
from __init__ import create_app, db

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


app = create_app()
if __name__ == '__main__':
    db.create_all(app=create_app())
    app.run(debug=True, host='0.0.0.0')
