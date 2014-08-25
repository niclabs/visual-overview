function determineSeparator(url){
	var separatorList = [",",";","|","\t"];
	var separator = "";
	var sPosition = 0;
	var maxOccurrence = 0;
	d3.text(url, function(data){
		if(data == null){
			alert("Couldn't parse dataset");
			return;
		}
		var sample = data.substring(0,50000);
		for(var i=0; i < separatorList.length; i++){
			separator = separatorList[i];			
			var occurrence = sample.split(separator).length;
			if(occurrence > maxOccurrence){
				maxOccurrence = occurrence;
				sPosition = i;
			}
		}
		separator = separatorList[sPosition];
		detectHeader(data, separator);
	})

}

function detectHeader(data, separator){
	var annotations = [];
	var dsv = d3.dsv(separator, "text/plain");
	var rows = dsv.parseRows(data);
	var footer = [];
	var length = rows.length;
	for(var i=0; i<length; i++){
		if(isHeader(rows[i])){
			annotations = rows.splice(0,i);
			break;
		}
	}
	footer = detectFooter(rows);
	console.log(annotations);
	console.log(rows);
	console.log(footer);

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

function detectFooter(rows){
	var footer = [];
	rows.reverse();
	var length = rows.length;
	for(var i=0; i<length; i++){
		if(isHeader(rows[i])){
			footer = rows.splice(0,i);
			break;
		}
	}
	rows.reverse();
	footer.reverse();
	return footer;
}
