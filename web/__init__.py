from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from .models import db

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = '12345'
    
    # Database configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/student_portal'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    
    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.login_view = 'views.student'
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(id):
        return Student.query.get(id)
    
    # Create all database tables
    with app.app_context():
        db.create_all()
    
    return app