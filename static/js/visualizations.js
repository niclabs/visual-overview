/* This document contains every visualization and visualizations helpers functions */

/* General method for choosing wich visualization to draw*/
function drawVisualization(data, header, columnTypes, position){
	
	var id = "viz"+header[position].toLowerCase().replace(/[^0-9a-z-]/g,"")+position;

	if(columnTypes[position] == "latitude"){
		
		var td = $("<td>").attr("class", "1rowaa").attr("id", id).css("width", "200px").css("height","200px");

		addSelect(header,position, columnTypes[position], data, id);
		drawMap(data, columnTypes, header, td, id, true, "", "");
		drawHistogram(data, header[position], position);
		addCheckBox(header,position);
		
	}else if(columnTypes[position] == "longitude"){

		var td = $("<td>").attr("class", "1rowaa").attr("id", id).css("width", "200px").css("height","200px");
		$("#row").append(td);

		addSelect(header,position, columnTypes[position], data, id);
		drawHistogram(data, header[position], position);
		addCheckBox(header,position);

	}else if(columnTypes[position] == "date"){

		var td = $("<td>").attr("class", "1rowaa").attr("id", id).css("width", "200px");
		var text = $("<h6>").html("Date occurrences for column " + header[position]);

		addSelect(header,position, columnTypes[position], data, id);
		drawCalendar(data, header[position], td, id, text, true, false);
		drawHistogram(data, header[position], position);
		addCheckBox(header,position);

	}else if(columnTypes[position] == "default"){

		var defaultType = getDefaultType(data, header[position]);
		if(defaultType == "numerical"){
			
			var td = $("<td>").attr("class", "1rowaa").attr("id", id).css("width", "200px").css("height","200px");
			var text = $("<h6>").html("BoxPlot for column " + header[position]);

			addSelect(header,position, defaultType, data, id);
			drawBoxPlot(data, header[position], td, id, text, true);
		}
		else{

			addSelect(header,position, defaultType, data, id);
			drawWordCloud(data, header[position], id, true);
		}
		drawHistogram(data, header[position], position);
		addCheckBox(header,position);
	}
	else{
		drawHistogram(data, header[position], position);
		addCheckBox(header,position);
	}
}

function getDefaultType(data, key){
	var type = "default";
	var sample = getRandomSample(data, 200);
	// This for is only used for checking if there are undefined values
	for(var i = 0; i<data.length; i++){
		var row = sample[i];
		if(row[key] == undefined){
			continue;		
		}

		if(isNumber(row[key].replace("%","").replace("$",""))){
			type = "numerical";
			break;		
		}
		else{
			break;		
		}		
	}	
	return type;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/////////////////////////////////////////////////////////////////////////////
////////////////////////////* Select and Redraw *////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function addSelect(header, position, columnType, data, tdId){
	var key = header[position];
	var options = ['BoxPlot', 'WordCloud', 'Map', 'Time Series'];
	var newSelect = document.createElement('select');
	var id = "select" + position;
	$(newSelect).attr("class", key);
	$(newSelect).attr("id", id);
	var index = 0;
	for(element in options){
	   var opt = document.createElement("option");
	   opt.value= options[element];
	   opt.innerHTML = options[element]; // whatever property it has
	   
	   if(translate(columnType) == options[element]){
	   	opt.selected = "selected";	
	   }
	

	   // then append it to the select element
	   newSelect.appendChild(opt);
	   index++;
	}

	$(newSelect).on("change",function(){

		var newType = $('#'+id+' option:selected').text();
		reDraw(data, header, position, tdId, newType);
		updateURI(newType, position);
	});

	var id = "select"+key.toLowerCase().replace(/[^0-9a-z-]/g,"")+position;

	var td = $("<td>").attr("class", "1rowaa").attr("id", id);
	$("#select").append(td);
	var text = $("<h6>").html("Data type");
	td.append(text);
	td.append(newSelect);
	

}

function addCheckBox(header, position){
	var newCheckBox = document.createElement("INPUT");
	newCheckBox.setAttribute("type", "checkbox");
	var id = "check" + position;
	var key = header[position];
	$(newCheckBox).attr("class", key);
	$(newCheckBox).attr("id", id);
	
	var id = "check"+key.toLowerCase().replace(/[^0-9a-z-]/g,"")+position;

	var td = $("<td>").attr("class","1rowaa").attr("id", id);
	$("#check").append(td);
	var text = $("<h6>").html("Select column "+header[position]);
	td.append(text);
	td.append(newCheckBox);

}

function updateURI(newType, position){
	var key = "select"+position;
	var hash = location.href.split("#")[1].split("&");
	var newURI = hash[0];
	var update = false;
	for(var i = 1; i < hash.length; i++){
		var select = hash[i].split("=");
		if(select[0] == key){
			hash[i] = key+"="+newType;
			update = true;
			break;		
		}
	}
	
	for(var i = 1; i < hash.length; i++){
		newURI = newURI+"&"+hash[i];
	}
	if(update)
		window.location.hash = newURI;
	else
		window.location.hash = newURI+"&"+key+"="+newType;
}

function translate(columnType){
	var t;
	switch(columnType){
		case "default":
			t = "WordCloud";
			break;
		case "numerical":
			t = "BoxPlot";
			break;
		case "latitude":
			t = "Map";
			break;
		case "longitude":
			t = "Map";
			break;
		case "date":
			t = "Time Series";
			break;
	}
	return t;
}

function reDraw(data, header, position, tdId, newType){
	var key = header[position];

	if(newType == "WordCloud"){
		drawWordCloud(data, key, tdId, false);
	}
	else if(newType == "BoxPlot"){
		var check = false;
		if(getDefaultType(data, key) == 'numerical'){
			check = true;
		}

		if(check == true){
			var td = $("#"+tdId);
			var text = $("<h6>").html("Data");
			drawBoxPlot(data, key, td, tdId, text, false);
		}else{
			alert("Cannot Parse as Number");
		}
	}
	else if(newType == "Time Series"){
		var td = $("#"+tdId);
		var text = $("<h6>").html("Date occurrences");
		drawCalendar(data, key, td, tdId, text, false, false);		
	
	}
	else if(newType == "Map"){
		var td = $("#"+tdId);
		var text = $("<h6>").html("Date occurrences");
		var nextpos = parseInt(position)+1;
		var prevpos = parseInt(position)-1;
		/* Nota: siempre se asume que latitud esta a la izquierda de longitud */
		if(checkLatitude(data, key) && checkLongitude(data, header[nextpos])){
			drawMap(data, [], header, td, tdId, text, false, key, header[nextpos]);	
		}else if(checkLongitude(data, key) && checkLatitude(data, header[prevpos])){
			td = td.prev();
			tdId = td.attr("id");
			drawMap(data, [], header, td, tdId, text, false, header[prevpos], key);	
		}else{
			alert("Cannot Parse as Map");		
		}
	}
	else{
		alert("SOON!");	
	}
}

/////////////////////////////////////////////////////////////////////////////
////////////////////////////////* Histogram *////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function drawHistogram(data, key, position){
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
 	id = "h"+key.toLowerCase().replace(/[^0-9a-z-]/g,"")+position;
	
	div = d3.select("#hist").append("td").attr("class", "1rowaa").attr("id", id);
	histogram = getRandomSample(wordArray, wordArray.length);
	d3.select("#"+id).append("h6").html("Sampled histogram");
	bar(getTopK(histogram, histogram.length), id);
}

/////////////////////////////////////////////////////////////////////////////
////////////////////////////////* Word Cloud *///////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function drawWordCloud(data, key, id, auto){
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

	if(auto == false)
		d3.select("#"+id).html("");	
	else
 		div = d3.select("#row").append("td").attr("class", "1rowaa").attr("id", id);

	d3.select("#"+id).append("h6").html("Most common values in column "+key);
	wordcloud(topk, id);

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
			tr.append("td").style("width","200px").html(data[i]	[j]);
		}
	}
}

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////* Box Plot *////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function drawBoxPlot(data, key, td, id, text, auto){
	// Create an array only with the numbers
	var numArray = [];
	for(var i = 0; i < data.length; i++){
		var row = data[i];
		if(row[key] == undefined){
			continue;		
		}
		if(isNaN(parseFloat(row[key].replace("$","").replace("%","")))){
			continue;		
		}
		numArray.push(parseFloat(row[key].replace("$","").replace("%","")));
	}
	// Sort the array;
	numArray.sort(function(a, b) {
  			return a - b;
		});
	// Get data
	var minimum = parseFloat(numArray[0]);
	var maximum = parseFloat(numArray[numArray.length-1]);
	var median = parseFloat(getMedian(numArray));
	var lowerQ = parseFloat(getMedian(numArray.slice(0, Math.floor(numArray.length/2))));
	var upperQ = parseFloat(getMedian(numArray.slice(Math.floor(numArray.length/2), numArray.length)));

	// Create container div
	var canvasId = "canvas" + id;
	var boxPlotCanvas = $("<div>", {id: canvasId, style: "width: 200px; height: 200px; position: absolute; background-color: transparent;"});

	if(auto == true)
		$("#row").append(td);
	else
		d3.select("#"+id).html("");


	td.append(text);
	td.append(boxPlotCanvas);
	
	// Draw box plot
	$(function () {
	    $('#'+canvasId).highcharts({

		chart: {
		    type: 'boxplot'
		},
 		
		title: {
            		text: ''
        	},

		legend: {
		    enabled: false
		},

		xAxis: {
		    categories: [''],
		    title: {
		        text: ''
		    }
		},

		yAxis: {
		    title: {
		        text: 'Data Values'
		    },
		    plotLines: [{
		        value: median,
		        color: 'red',
		        width: 1,
		        label: {
		            align: 'center',
		            style: {
		                color: 'gray'
		            }
		        }
		    }]
		},

		series: [{
		    name: 'Observations',
		    data: [
		        [minimum, lowerQ, median, upperQ, maximum],
		    ],
		    tooltip: {
		        headerFormat: '<em>Experiment No {point.key}</em><br/>'
		    }
		}]

	    });
	});
}

function getMedian(numArray){
	var length = numArray.length;
	var median;
	if(isEven(length)){
		var position = length/2;
		median = numArray[position];
	}else{
		var position = Math.floor(length/2);
		median = (parseFloat(numArray[position])+parseFloat(numArray[position+1]))/2;
	}
	return median;
}

function isEven(n) {
  return n == parseFloat(n)? !(n%2) : void 0;
}


/////////////////////////////////////////////////////////////////////////////
////////////////////////////* Map visualization *////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function drawMap(data, columnTypes, header, td, id, auto, latKey, longKey){
	var sample = getRandomSample(data, 200);
	if(latKey == ""){
		latKey = getKeyName("latitude", columnTypes, header);
		longKey = getKeyName("longitude", columnTypes, header);
	}
	var llRegex = /^(\-?\d+(\.\d+)?)/g;
	var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 1
        };

	var canvasId = "canvas"+id;
	var mapCanvas = $("<div>", {id: canvasId, style: "width: 400px; height: 200px; position: absolute; background-color: transparent;"});

	if(auto == true)
		$("#row").append(td);
	else
		td.empty();
		td.next().empty();

	var text = $("<h6>").html("Map for columns "+latKey+" and "+longKey);

	td.append(text);
	td.append(mapCanvas);

        var map = new google.maps.Map(document.getElementById(canvasId), mapOptions);
	
	for(var i in sample){
		// Check if latitude/longitude is in a google maps valid format
		if(sample[i][latKey] == undefined){
			continue;
		}
		if(llRegex.test(sample[i][latKey]) == false){
			latitude = ParseDMS(sample[i][latKey].replace("&deg","°"));
			longitude = ParseDMS(sample[i][longKey].replace("&deg","°"));
		}
		else{
			latitude = sample[i][latKey];
			longitude = sample[i][longKey];
		}

		// Create lat/lang google map variable
		myLatlng = new google.maps.LatLng(latitude,longitude);

		var marker = new google.maps.Marker({
    			position: myLatlng,
			map: map,
    			title:"Hello World!"
		});

		// Add markers and infowindows
		(function(marker, i) {
                	google.maps.event.addListener(marker, 'click', function() {
                		infowindow = new google.maps.InfoWindow({
                                	content: generateContent(sample[i])
                      		});
                        	infowindow.open(map, marker);
                    	});
		})(marker, i);		
	}
}

function getKeyName(type, columnTypes, header){
	var key = "";	
	for(var i = 0 ; i < columnTypes.length ; i++){
		if(columnTypes[i] == type){
			key = header[i];
		}
	}
	return key;
}

function generateContent(row){
	var content = "";
	for(var j in row){
		content = content + j + ":" + row[j] + "<br>";
	}
	return content;
}

/* This code is from http://stackoverflow.com/questions/1140189/converting-latitude-and-longitude-to-decimal-values */

function ParseDMS(input) {
    var parts = input.split(/[^\d\w]+/);
    var lat = ConvertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
    return lat;
}

function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = parseInt(degrees) + (minutes/60) + (seconds/(60*60));

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

/* End of external code */

/////////////////////////////////////////////////////////////////////////////
//////////////////////////* Calendar visualization */////////////////////////
/////////////////////////////////////////////////////////////////////////////

/* Nota, dateArray no es usado (por el momento) */
function drawCalendar(data, dateKey, td, id, text, auto, multi){
	//Create Variables
	var dateFormat = getDateFormat(data, dateKey);
	var googleData = new google.visualization.DataTable();
	var dateArray = extractDateArray(data, dateKey);
	var dateOcurrences = [];
	var canvasId = "canvas"+id;
	var calendarCanvas = $("<div>", {id: canvasId, style: "width: 300px; height: 200px; position: absolute; background-color: transparent;"});

	//Check if data is parseable as date
	if(dateFormat == "Error" && dateArray == false){
		alert("Date couldn't be parsed");
		return;
	}

	//Start adding info
	googleData.addColumn('date', 'Date');
	googleData.addColumn('number', 'Ocurrences');

	if(auto == true)
		$("#row").append(td);
	else
		d3.select("#"+id).html("");	

	td.append(text);
	td.append(calendarCanvas);

	for(var i in data){
		if(data[i][dateKey] == undefined){
			continue;
		}else if(badDate(data[i][dateKey])){
			continue;	
		}
		
		date = data[i][dateKey];
		if(dateOcurrences.indexOf(date) == -1){
			dateOcurrences.push(date);
			ocurrences = countDateOcurrences(date, data, dateKey);
			date = createDate(dateFormat, date);
			if(isNaN(date)){
				continue;
			}
			googleData.addRow([date, ocurrences]);
		}
	}
	
	//Draw
	var chart = new google.visualization.AnnotationChart(document.getElementById(canvasId));
	var options = {
          displayAnnotations: true
        };
	chart.draw(googleData, options);
}

function createDate(dateFormat, date){
	dateArray = date.split(/[-\/.]/);
	var date = new Date(dateArray[dateFormat.indexOf("year")],dateArray[dateFormat.indexOf("month")],dateArray[dateFormat.indexOf("day")]);
	return date;
}

function extractDateArray(data, key){
	var i = 0;
	var dateArray = [];
	for(var j in data){
		var dateString = data[j][key];
		dateArray[i] = new Date(dateString);
		if(dateArray[i] == "Invalid Date"){
			dateArray = false;
			break;
		}
		i++
	}
	return dateArray;
}

function countDateOcurrences(date, data, key){
	var i = 0;
	for(var j in data){
		var compDate = data[j][key];
		if(date == compDate){
			i++;
		}
	}
	return i;
}

function getDateFormat(data, key){
	var ddmmyyyy = 0;
	var mmddyyyy = 0;
	var dateFormat = "Error";
	for(var i in data){
		if(data[i][key] == undefined){
			continue;
		}
		var dateArray = data[i][key].split(/[-\/.]/);
		if(dateArray.length < 3){
			continue;
		}else if(dateArray[2] > 12){
			dateFormat = ["day", "month", "year"];
			break;
		}else if(dateArray[1] > 12){
			dateFormat = ["month", "day", "year"];
			break;
		}
	}
	return dateFormat;
}

function badDate(date){
	var dateArray = date.split(/[-\/.]/);
	var isBad = false;
	if(dateArray.length < 3){
		isBad = true;	
	}
	return isBad;
}
