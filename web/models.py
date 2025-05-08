from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = 'students'
    
    student_id = db.Column(db.String(20), primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    section = db.Column(db.String(20), nullable=False)
    program = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)

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