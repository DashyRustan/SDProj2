from flask import Blueprint, render_template, request, jsonify
from .models import db, Student, Inventory

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template('test.html')

@views.route('/student', methods=['GET', 'POST'])
def student():
    if request.method == 'POST':
        data = request.json
        new_student = Student(
            student_id=data['student-id'],
            full_name=data['name'],
            year=int(data['year']),
            section=data['section'],
            program=data['program'],
            email=data['email']
        )
        try:
            db.session.add(new_student)
            db.session.commit()
            return jsonify({'success': True})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)})
    return render_template('student.html')

@views.route('/inventory', methods=['GET', 'POST'])
def inventory():
    if request.method == 'POST':
        data = request.json
        new_item = Inventory(
            category=data['category'],
            class_=data['class'],
            item_description=data['description'],
            date_acquired=data['date_acquired'],
            location=data['location'],
            remarks=data['remarks']
        )
        try:
            db.session.add(new_item)
            db.session.commit()
            return jsonify({'success': True})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)})
    items = Inventory.query.all()
    return render_template('inventory.html', items=items)