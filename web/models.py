from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import UserMixin

db = SQLAlchemy()

class Student(UserMixin, db.Model):
    __tablename__ = 'students'
    
    student_id = db.Column(db.String(20), primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    section = db.Column(db.String(20), nullable=False)
    program = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    
    def get_id(self):
        return self.student_id

class Inventory(db.Model):
    __tablename__ = 'inventory'
    
    no = db.Column(db.Integer, primary_key=True)
    mem_rec = db.Column(db.String(255))
    category = db.Column(db.String(255), nullable=False)
    class_ = db.Column(db.String(255), nullable=False)
    item_description = db.Column(db.Text, nullable=False)
    date_acquired = db.Column(db.Date)
    location = db.Column(db.String(255))
    remarks = db.Column(db.Text)

class Reservation(db.Model):
    __tablename__ = 'reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), db.ForeignKey('students.student_id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('inventory.no'), nullable=False)
    reservation_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    return_time = db.Column(db.DateTime)
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, ongoing, finished
    professor_signature = db.Column(db.Text)
    
    student = db.relationship('Student', backref='reservations')
    item = db.relationship('Inventory', backref='reservations')