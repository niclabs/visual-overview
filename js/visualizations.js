function determine_dominant_visualization(columnTypes){
	var visualization = "default";        
	for(var i = 0; i<columnTypes.length ; i++){
		if(columnTypes[i] == "latitude" && visualization != "calendar"){
			visualization = "map";
		}
	}
	return visualization;
}

/* Visualization functions from first visual-overview version. They are now considered as "default" visualization */

function defaultVisualization(data, key){
	var keys = {};
	var words = {};
	for(var i=0; i<data.length; i++){
		var row = data[i];
		if(row[key] == undefined){	
			continue;
		}
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
 	id = key.toLowerCase().replace(/[^0-9a-z-]/g,"");
	console.log(id);

 	div = d3.select("#row").append("td").attr("class", "1rowaa").attr("id", id);
	console.log("aquí");
	d3.select("#"+id).append("h6").html("Most common values");
	console.log("sigo vivo");
	wordcloud(topk, id);
	console.log("wordcloud");
	histogram = getRandomSample(wordArray, wordArray.length);
	console.log("histograma");
	d3.select("#"+id).append("h6").html("Sampled histogram");
	bar(getTopK(histogram, histogram.length), id);

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

/* End of previous visualization */
