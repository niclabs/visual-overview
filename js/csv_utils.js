function initialize_visualization(url){	
	$("#visualization").trigger("start_load");	
	var data = new Array(3);
	var columnTypes = []
	//Get the csv in text format
	d3.text(url, function(data){
		if(data == null){
			alert("Couldn't parse dataset");
			return;
		}
		/* Separate data from annotations in an array where
			possition 0: annotations
			possition 1: rows
			possition 2: footer] */
		data = detectHeader(data, determineSeparator(data));
		// Get the data type of each column
		columnTypes = determineColumnTypes(data[1][0]);
		// Visualize
		visualize(data[0], data[1], data[2], columnTypes);
	})
}

function visualize(annotations, rows, footer, columnTypes){	
	//Delete any previous information	
	d3.select("#headerrow").selectAll("th").remove();
    	d3.select("#tbody").selectAll("tr").remove();

	//Set the information in javascript object notation
    	data = d3.csv.formatRows(rows);
	data = d3.csv.parse(data);

	//Check if there is data
    	if(data.length == 0){
    	 	return;
    	}
	//Add a preview
	header = rows[0];	
	addPreview(data, 5);
	for(var j in header){
		d3.select("#headerrow").append("th").html(header[j]);
	}

	//Determine dominant visualization
	visualization = determine_dominant_visualization(columnTypes);

	//Visualize
	if(visualization == "map"){
		initialize_map(data, columnTypes, header);
	}
	else{
		for(var j in header){
			defaultVisualization(data, header[j]);
		}
	}

	$("#visualization").trigger("loaded");
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


