from flask import Flask, render_template, jsonify, request
import base64
import re
from io import BytesIO
from PIL import Image
import pymongo
from pymongo import MongoClient  # pymongo를 임포트 하기(패키지 인스톨 먼저 해야겠죠?)
from datetime import datetime
import os
ALLOWED_EXTENSIONS = ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif']

app = Flask(__name__)
app.config.from_object(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
client = MongoClient('localhost', 27017)  # mongoDB는 27017 포트로 돌아갑니다.
db = client.dbsparta  # 'dbsparta'라는 이름의 db를 만듭니다.


def decode_base64(data, altchars=b'+/'):
    """Decode base64, padding being optional.

    :param data: Base64 data as an ASCII byte string
    :returns: The decoded byte string.

    """
    data = re.sub(rb'[^a-zA-Z0-9%s]+' % altchars, b'', data)  # normalize
    missing_padding = len(data) % 4
    if missing_padding:
        data += b'=' * (4 - missing_padding)
    return base64.b64decode(data, altchars)


## HTML을 주는 부분
@app.route('/')
def home():
    return render_template('index.html')


@app.route('/question')
def question():
    return render_template('question.html')

@app.route('/question_answer')
def question_answer():
    return render_template('question_answer.html')

@app.route('/posting', methods=['POST'])
def write_order():
    title_receive = request.form['title_give']
    text_receive = request.form['text_give']
    type_receive = request.form['type_give']
    username_receive = request.form['username_give']
    file_list_receive = request.form['file_list_give']
    #file_receive = request.form['file_give']
    #print(len(file_receive))
    #image_data = decode_base64(file_receive.encode())
    #im = Image.open(BytesIO(image_data))
    #im.save('test.png')


    submitting = {
        'title': title_receive,
        'text': text_receive,
        'type': type_receive,
        'username': username_receive,
        'file_list': file_list_receive
    }

    db.posting.insert_one(submitting)
    return jsonify({'result': 'success', 'msg': '질문이 등록되었습니다.'})


@app.route('/posting', methods=['GET'])
def read_posting():
    posting = list(db.posting.find({}, {'_id': 0}))
    return jsonify({'result': 'success', 'posting': posting})

@app.route('/answer', methods=['POST'])
def write_answer():
    text_receive = request.form['text_give']
    username_receive = request.form['username_give']
    file_list_receive = request.form['file_list_give']
    #file_receive = request.form['file_give']
    #print(len(file_receive))
    #image_data = decode_base64(file_receive.encode())
    #im = Image.open(BytesIO(image_data))
    #im.save('test.png')


    answer_submitting = {
        'answer_text': text_receive,
        'answer_username': username_receive,
        'answer_file_list': file_list_receive
    }

    db.answer.insert_one(answer_submitting)
    return jsonify({'result': 'success', 'msg': '답변이 등록되었습니다.'})

@app.route('/answer', methods=['GET'])
def read_answer():
    answering = list(db.answer.find({}, {'_id': 0}))
    return jsonify({'result': 'success', 'answering': answering})

@app.route('/api/upload', methods=['POST'])
def post_upload():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            now = datetime.now()
            filename = os.path.join(app.config['UPLOAD_FOLDER'], "%s.%s" % (now.strftime("%Y-%m-%d-%H-%M-%S-%f"), file.filename.rsplit('.', 1)[1]))
            file.save(filename)
            return jsonify({
                'result': 'success',
                'file_path': filename
            })

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS



if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)

