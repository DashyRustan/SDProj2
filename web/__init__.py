from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .models import db

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = '12345'
    
    # Database configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/student_portal'
    app.config['SQLALCHEMY_BINDS'] = {
        'inventory': 'mysql://root:@localhost/equipment_inventory'
    }
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    
    return app