function detectHeader(url){
	var headers = [];
	var annotations = [];
	d3.text(url, function(data){
		var rows = d3.csv.parseRows(data);
		var length = rows.length;
		console.log(length);
		for(var i=0; i<length; i++){
			if(isHeader(rows[i])){
				annotations = rows.splice(0,i);
				headers = rows.shift();
				break;
			}
		}
		console.log(annotations);
		console.log(headers);
		console.log(rows);
	});
}

function isHeader(row){
	if(containsEmpty(row) || containsNumbers(row))
		return false;
	return true;
}

function containsEmpty(row){
	var isEmpty = false;
	for(var i=0; i<row.length; i++){
		if(row[i] == ""){
			isEmpty = true;
			break;
		}
	}
	return isEmpty;
}

function containsNumbers(row){
	var hasNumber = false;
	var regex = /\d/;
	for(var i=0; i<row.length; i++){
		if(regex.test(row[i])){
			hasNumber = true;
			break;
		}
	}
	return hasNumber;
}
