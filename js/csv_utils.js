function determineSeparator(url){
	var separatorList = [",",";","|","\t"];
	var separator = "";
	var sPosition = 0;
	var maxOccurrence = 0;
	d3.text(url, function(data){
		if(data == null){
			console.log("Couldn't parse data");
		}
		var sample = data.substring(0,50000);
		/*for(var i=0; i < separatorList.length; i++){
			separator = separatorList[i];
			var occurrence = sample.split(separator).length;
			console.log(occurrence);
			if(occurrence > maxOccurrence){
				maxOcurrence = occurrence;
				sPosition = i;
			}
		}*/
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
    if(subString.length<=0) 
	return string.length+1;

    var n=0, pos=0;

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=1; } else break;
    }
    return(n);
}

function detectHeader(data, separator){
	var annotations = [];
	var dsv = d3.dsv(separator, "text/plain");
	var rows = dsv.parseRows(data);
	var length = rows.length;
	for(var i=0; i<length; i++){
		if(isHeader(rows[i])){
			annotations = rows.splice(0,i);
			break;
		}
	}
	console.log(annotations);
	console.log(rows);

}

function isHeader(row){
	var minimum = 5;
	var maxEmpty = Math.floor(row.length/2);
	if(containsEmpty(row, maxEmpty) || row.length < minimum)
		return false;
	return true;
}

function containsEmpty(row, maxEmpty){
	var empty = 0;
	var isEmpty = false;
	for(var i=0; i<row.length; i++){
		if(row[i] == ""){
			empty++;
		}
	}
	if(empty>maxEmpty){
		isEmpty = true;
	}
	return isEmpty;
}
