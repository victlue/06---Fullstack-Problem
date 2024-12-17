from flask import Flask, jsonify, request, render_template, redirect, url_for, session
from database import SessionLocal, engine
from models import Base, Task

app = Flask(__name__)
app.secret_key = "pingpongpi"

# Create tables if not exist
Base.metadata.create_all(bind=engine)

@app.route('/')
def home():
    if 'logged_in' in session and session['logged_in']==True:
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def attempt_login():
    data=request.get_json()
    if 'username' not in data or 'password' not in data:
        return jsonify({'error': 'username or password not found'}), 400
    else:
        username=data['username']
        password=data['password']
        if username=="admin" and password=="secret":
            session['logged_in']=True
            return jsonify({'success': True, 'redirect': '/index'}), 200
        else:
            return jsonify({'error': 'wrong credentials'}), 400

@app.route('/logout', methods=['POST'])
def log_out():
    print("logout python1")
    if 'logged_in' in session and session['logged_in']==True:
        session['logged_in']=False
        print("logout python")
    return jsonify({'success': True, 'redirect': '/'}), 200

@app.route('/index',  methods=['GET', 'POST'])
def index():
    if 'logged_in' in session and session['logged_in']==True:
        return render_template('index.html')
    return redirect('/')

@app.route('/tasks', methods=['GET'])
def get_tasks():
    # TODO: Implement code to query all tasks and return them as JSON
    db_session=SessionLocal()
    try:
        results=db_session.query(Task).all()
        tasks_dicts=[]
        for t in results:
            tasks_dicts.append({'id': t.id,
            'description': t.description,
            'completed': t.completed})
        return jsonify(tasks_dicts)
    finally:
        db_session.close()

@app.route('/tasks', methods=['POST'])
def create_task():
    # TODO: Implement code to read 'description' from JSON body, create a new task, save it, and return it
    db_session=SessionLocal()
    try:
        data=request.get_json()
        if 'description' not in data:
            return jsonify({'error': 'description not found'}), 400
        else:
            description=data['description']
            new_task=Task(description=description)
            db_session.add(new_task)
            db_session.commit()

            return jsonify({
                'id':new_task.id,
                'description':new_task.description,
                'completed': new_task.completed
            })
    finally:
        db_session.close()
    

@app.route('/tasks/<int:id>', methods=['PATCH'])
def complete_task(id):
    db_session=SessionLocal()
    # TODO: Implement code to find the task by id, mark completed=True, save, and return it
    try:
        task=db_session.query(Task).filter(Task.id==id).one_or_none()
        if not task:
            return jsonify({'error': 'task not found'}), 400
        task.completed=True
        db_session.commit()
        return jsonify({
                    'id':task.id,
                    'description':task.description,
                    'completed': task.completed
        })
    finally:
        db_session.close()
    

if __name__ == '__main__':
    app.run(debug=True)