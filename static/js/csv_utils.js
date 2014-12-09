function initialize_visualization(url){		
	var data = new Array(3);
	var columnTypes = [];
	//Delete any previous information
	d3.select("#headerrow").selectAll("th").remove();
    	d3.select("#tbody").selectAll("tr").remove();
	d3.select("#map-canvas").html("");
	$("#loadingDiv").show();

	var request = d3.text("/proxy?url="+url)
		.on("load",  function(data){
			if(data == null){
				alert("Couldn't parse dataset");
				return;
			}
			try{
				var separator = determineSeparator(data);
				var dsv = d3.dsv(separator, "text/plain");
				var rows = dsv.parseRows(data);
				var header = rows[0];
				header = header.filter(function(n){ return n != "" });
				data = d3.csv.formatRows(rows);
				data = d3.csv.parse(data);
				columnTypes = determineColumnTypes(header);
				visualize(data, header, columnTypes);
			}catch(err){
				alert("An error ocurred while processing the dataset");
				console.log(err);
				d3.select("#headerrow").selectAll("th").remove();
    				d3.select("#tbody").selectAll("tr").remove();
				d3.select("#map-canvas").html("");
				$("#visualization").trigger("loaded");			
			}
		})
		.on("error", function(){
			alert("Data couldn't be loaded");
			$("#visualization").trigger("loaded");
		});

	setTimeout(function(){request.get();}, 500);
}

function visualize(data, header, columnTypes){
	//Check if there is data
    	if(data.length == 0){
    	 	return;
    	}

	addPreview(data, 5);

	for(var j in header){
		if(columnTypes[j] == "date"){
			d3.select("#headerrow").append("th").style("width", "310px").html(header[j]);
		}
		else{
			d3.select("#headerrow").append("th").style("width", "210px").html(header[j]);
		}
	}
	
	d3.select('#tbody').append("tr").attr("id", "select");
	d3.select("#tbody").append("tr").attr("id", "row");
	d3.select("#tbody").append("tr").attr("id", "hist");

	//Add visualization
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
