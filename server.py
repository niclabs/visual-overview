from flask import Flask
from flask import render_template, request
import requests
import StringIO
import math
import csv

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route("/proxy")
def proxy():
	r = requests.get(request.args.get('url'))
	return r.text

@app.route("/column")
def getColumn():
	r = requests.get(request.args.get('url'))
	number = int(request.args.get('number'))
	text = r.text
	separator = determineSeparator(text)
	csvFile = getTable(text, separator)
	column = []
	i = 0

	for line in csvFile.readlines():
		row = line.split(separator)
		column.append(row[number])
		i = i+1

	return '\n'.join(column)

def determineSeparator(data):
	separatorList = [',',';','|','\t']
	maxOccurrence = 0
	finalSeparator = ','
	sample = data[0:50000]

	for separator in separatorList:
		occurrence = len(sample.split(separator))
		if occurrence > maxOccurrence:
			maxOccurrence = occurrence
			finalSeparator = separator

	return finalSeparator

def getTable(data, separator):
	aux = StringIO.StringIO(data)
	counter = 0
	for line in aux.readlines():
		row = line.split(separator)
		if isHeader(row):
			break
		counter = counter+1
	data = data.split('\n',counter)[-1]
	return StringIO.StringIO(data)

def isHeader(row):
	minimum = 2
	maxEmpty = math.floor(len(row)/2)
	if containsEmpty(row, maxEmpty) or len(row) < minimum:
		return False
	return True

def containsEmpty(row, maxEmpty):
	empty = 0
	isEmpty = False
	for i in range(len(row)):
		if row[i] == '':
			empty = empty+1
	if empty > maxEmpty:
		isEmpty = True
	
	return isEmpty

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")



