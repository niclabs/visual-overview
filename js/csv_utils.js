function initialize_visualization(url){	
		
	var data = new Array(3);
	var columnTypes = [];
	//Delete any previous information	
	d3.select("#headerrow").selectAll("th").remove();
    	d3.select("#tbody").selectAll("tr").remove();
	d3.select("#map-canvas").html("");
	$("#loadingDiv").show();

	/*var request = d3.text(url)*/
	var request = d3.text("http://viz.niclabs.cl/visualoverviews/proxy.php?url="+url)
		.on("load",  function(data){
			if(data == null){
				alert("Couldn't parse dataset");
				return;
			}
			data = detectHeader(data, determineSeparator(data));
			columnTypes = determineColumnTypes(data[1][0]);
			visualize(data[0], data[1], data[2], columnTypes);
		})
		.on("error", function(){
			alert("Data couldn't be loaded");
			$("#visualization").trigger("loaded");	
		});
	
	setTimeout(function(){request.get();}, 500);
}

function visualize(annotations, rows, footer, columnTypes){	


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
		if(columnTypes[j] == "date"){
			d3.select("#headerrow").append("th").style("width", "310px").html(header[j]);
		}
		else{
			d3.select("#headerrow").append("th").style("width", "210px").html(header[j]);
		}
	}

	d3.select("#tbody").append("tr").attr("id", "row");
	d3.select("#tbody").append("tr").attr("id", "hist");
	for(var j in header){
		drawVisualization(data, header, columnTypes, j);
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


