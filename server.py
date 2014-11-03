from flask import Flask
from flask import render_template, request
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', name=name)


@app.route("/proxy")
def proxy():
	r = requests.get(request.args.get('url'))
	return r.text


if __name__ == '__main__':
    app.run(debug=True)

