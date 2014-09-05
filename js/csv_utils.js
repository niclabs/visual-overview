function initialize_visualization(url){
	$("#visualization").trigger("start_load");	
	var data = new Array(3);
	var columnTypes = []
	d3.text(url, function(data){
		if(data == null){
			alert("Couldn't parse dataset");
			return;
		}
		/* data: [0: annotations, 1: rows, 2: footer] */
		data = detectHeader(data, determineSeparator(data));
		columnTypes = determineColumnTypes(data[1][0]);
		visualize(data[0], data[1], data[2], columnTypes);
	})
}

function visualize(annotations, rows, footer, columnTypes){
	var map = false; 	
	d3.select("#headerrow").selectAll("th").remove();
    	d3.select("#tbody").selectAll("tr").remove();

    	data = d3.csv.formatRows(rows);
	data = d3.csv.parse(data);

    	if(data.length == 0){
    	 	return;
    	}
    
	header = data[0];	
	addPreview(data, 5);
	
	for(var j in header){
		d3.select("#headerrow").append("th").html(j);
		defaultVisualization(data, j);
	}

	if(map == true){
		initialize_map(data, 10);
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

function determineColumnTypes(data){
	return ["latitude", "longitude"];
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

/* Métodos visualización anterior, agregados para la demo */

function defaultVisualization(data, key){
	var keys = {};
	var words = {};
	for(var i=0; i<data.length; i++){
		var row = data[i];
		var w = row[key].toString().toLowerCase();
		if(isStopWord(w)){
			continue;
		}
		if(keys[key] ==  undefined){
			keys[key] = 1;
		}else{
			keys[key]++;
		}
		if(words[w] ==  undefined){
			words[w] = 1;
		}else{
			words[w]++;
		}
	}
	wordArray = [];
	for(var i in words){
		wordArray.push({text: i, size: words[i]});
	}
	//Get wordcloud
	topk = getTopK(wordArray, 50);
 	id = key.toLowerCase().replace(" ", "")

 	div = d3.select("#row").append("td").attr("class", "1rowaa").attr("id", id);
	d3.select("#"+id).append("h6").html("Most common values");
	wordcloud(topk, id);
	histogram = getRandomSample(wordArray, wordArray.length);
	d3.select("#"+id).append("h6").html("Sampled histogram");
	bar(getTopK(histogram, histogram.length), id);
    	d3.select("#tbody").append("tr").attr("id", "row");
}

function isStopWord(w){
	return false;
	if(w.match(/\d+/) != undefined){
		return true;
	}
	if(w.length < 3){
		return true;
	}
	return false;
}

function getRandomSample(w, n){
	_limit = Math.min(n, w.length); //200 is the width of the window.
	_results = [];
	_repeatedNumbers = [];
	//for(var i =0; i<_limit; i++){
	while(_results.length < _limit){
		number = parseInt(Math.random(0, w.length) * w.length);
		if(_repeatedNumbers.indexOf(number) >= 0){
			continue;
		}
   		_results.push(w[number]);
    		_repeatedNumbers.push(number);
	}
	return _results;
}

function getTopK(w, k){
	_aux = w.sort(function(a, b){
		if( a.size > b.size){
			return -1;
		}
		if( a.size < b.size){
			return 1;
		}
		return 0;
	})
	_topk = [];
	for(var i=0; i<Math.min(k, _aux.length); i++){
		_topk.push(_aux[i]);
	}
	return _topk;
}

function addPreview(data, n){
	tbody = d3.select("#tbody");
	for(var i=0; i<n; i++){
		var tr = tbody.append("tr").attr("class", "preview");
		for(var j in data[i]){
			tr.append("td").html(data[i]	[j]);
		}
	}
}
