from flask import Flask
from flask import render_template, request
import requests
import StringIO
import math
import csv
import xlrd
from xlrd import open_workbook

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route("/proxy")
def proxy():
	r = requests.get(request.args.get('url'))
	ctype = r.headers["content-type"]

	if ctype == "text/csv":
		text = r.text
		separator = determineSeparator(text)
	else:
		text = csv_from_excel(StringIO.StringIO(r.content))
		separator = ";"
		

	csvFile = getTable(text, separator)
	column = []
	
	for line in csvFile.readlines():
		column.append(line)
	
	return ''.join(column)

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


def csv_from_excel(r):
	wb = open_workbook(file_contents=r.read())
	name = ""
	csv = "";
	for s in wb.sheets():
		name = s.name
		break

	sheet = wb.sheet_by_name(name)
	for row in range(s.nrows):
		values = []
		for col in range(s.ncols):
			values.append(unicode(s.cell_value(row,col)).encode('utf-8'))
		csv = csv + ';'.join(values)
		csv = csv+"\n"

	return csv	

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5002)



