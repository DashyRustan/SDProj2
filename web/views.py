from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from flask_login import login_user, login_required, current_user
from .models import db, Student, Inventory, Reservation
from datetime import datetime

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
            login_user(new_student)
            return jsonify({'success': True})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)})
    return render_template('student.html')

@views.route('/electronics')
@login_required
def electronics():
    return render_template('electronics.html')

@views.route('/reservation', methods=['GET', 'POST'])
@login_required
def reservation():
    if request.method == 'POST':
        data = request.json
        new_reservation = Reservation(
            student_id=current_user.student_id,
            item_id=data['item_id'],
            professor_signature=data['signature']
        )
        try:
            db.session.add(new_reservation)
            db.session.commit()
            return jsonify({'success': True})
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'error': str(e)})
    
    # Only show reservations for the current user
    reservations = Reservation.query.filter_by(student_id=current_user.student_id).all()
    return render_template('reservations.html', reservations=reservations)

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

@views.route('/reservation/<int:id>/status', methods=['PUT'])
def update_reservation_status(id):
    data = request.json
    reservation = Reservation.query.get_or_404(id)
    reservation.status = data['status']
    if data['status'] == 'finished':
        reservation.return_time = datetime.utcnow()
    try:
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/student/reservations/<student_id>')
def student_reservations(student_id):
    reservations = Reservation.query.filter_by(student_id=student_id).all()
    return jsonify([{
        'id': r.id,
        'item': r.item.item_description,
        'reservation_time': r.reservation_time.isoformat(),
        'return_time': r.return_time.isoformat() if r.return_time else None,
        'status': r.status
    } for r in reservations])