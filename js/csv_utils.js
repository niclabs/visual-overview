function determineSeparator(url){
	var separatorList = [",",";","|","	"];
	var separator = "";
	var sPosition = 0;
	var maxOccurrence = 0;
	d3.text(url, function(data){
		if(data == null){
			console.log("Couldn't parse data");
		}
		var sample = data.substring(0,500);
		for(var i=0; i < separatorList.length; i++){
			separator = separatorList[i];
			var occurrence = occurrences(sample, separator);
			if(occurrence > maxOccurrence){
				maxOcurrence = occurrence;
				sPosition = i;
			}
		}
		separator = separatorList[sPosition];
		detectHeader(data, separator);
	})

}

/* Sacado de http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string */

function occurrences(string, subString){

    string+=""; subString+="";
    if(subString.length<=0) return string.length+1;

    var n=0, pos=0;
    var step= 1;

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
}

function detectHeader(data, separator){
	var headers = [];
	var annotations = [];
	var dsv = d3.dsv(separator, "text/plain");
	var rows = dsv.parseRows(data);
	var length = rows.length;
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

}

function isHeader(row){
	if(containsEmpty(row))
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
