function initialize(url){
	var data = new Array(3);
	var columnTypes = []
	d3.text(url, function(data){
		if(data == null){
			alert("Couldn't parse dataset");
			return;
		}
		/* data: [0: annotations, 1: rows, 2: footer] */
		data = detectHeader(data, determineSeparator(data));
		columnTypes = determineColumnTypes(data[1]);
		console.log(data[1]);
	})

}

function determineSeparator(data){
	var separatorList = [",",";","|","\t"];
	var maxOccurrence = 0;
	var sPosition = 0;
	var sample = data.substring(0,50000);
	for(var i=0; i < separatorList.length; i++){
		separator = separatorList[i];			
		var occurrence = sample.split(separator).length;
		if(occurrence > maxOccurrence){
			maxOccurrence = occurrence;
			sPosition = i;
		}
	}
	return separatorList[sPosition];
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
	return [annotations, rows, footer];

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

function determineColumnTypes(data){
	return data;
}

function isHeader(row){
	var minimum = 2;
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


