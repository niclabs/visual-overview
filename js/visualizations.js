
/* This document contains every visualization and visualizations helpers functions */

/* General method for choosing wich visualization to draw*/
function drawVisualization(data, header, columnTypes, position){
	if(columnTypes[position] == "latitude"){
		initialize_map(data, columnTypes, header);
	}else if(columnTypes[position] == "date"){
		drawCalendar(data, columnTypes, header, position);
	}else{
		defaultVisualization(data, header[position]);
	}
}

/////////////////////////////////////////////////////////////////////////////
//////////////////////////* Default visualization *//////////////////////////
/////////////////////////////////////////////////////////////////////////////

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

 	div = d3.select("#row").append("td").attr("class", "1rowaa").attr("id", id).style("width","200px");
	d3.select("#"+id).append("h6").html("Most common values");
	wordcloud(topk, id);
	histogram = getRandomSample(wordArray, wordArray.length);
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
			tr.append("td").style("width","200px").html(data[i]	[j]);
		}
	}
}

/////////////////////////////////////////////////////////////////////////////
////////////////////////////* Map visualization *////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function initialize_map(data, columnTypes, header){
	var sample = getRandomSample(data, 200);
	var latKey = getKeyName("latitude", columnTypes, header);
	var longKey = getKeyName("longitude", columnTypes, header);
	var llRegex = /^(\-?\d+(\.\d+)?)/g;
	var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 0
        };

	var mapCanvas = $("<div>", {id: "map-canvas", style: "width: 200px; height: 200px; position: absolute; background-color: transparent;"});
	var td = $("<td>").attr("class", "1rowaa").attr("id", "map").css("width", "200px");
	$("#row").append(td);
	var id = $("<h6>").html("Map");
	td.append(id);
	td.append(mapCanvas);

        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	
	for(var i in sample){
		// Check if latitude/longitude is in a google maps valid format
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

function drawCalendar(data, columnTypes, header, position){
	var dateKey = header[position];
	var dateFormat = getDateFormat(data, dateKey);
	var googleData = new google.visualization.DataTable();
	googleData.addColumn('date', 'Date');
	googleData.addColumn('number', 'Ocurrences');
	var dateOcurrences = [];

	var calendarCanvas = $("<div>", {id: "calendar-canvas", style: "width: 200px; height: 200px; position: absolute; background-color: transparent;"});
	var td = $("<td>").attr("class", "1rowaa").attr("id", "calendar").css("width", "200px");
	$("#row").append(td);
	var id = $("<h6>").html("Date");
	td.append(id);
	td.append(calendarCanvas);

	for(var i in data){
		date = data[i][dateKey];
		if(dateOcurrences.indexOf(date) == -1){
			dateOcurrences.push(date);
			ocurrences = countDateOcurrences(date, data, dateKey);
			date = createDate(dateFormat, date);
			if(isNaN(date)){
				continue;
			}
			console.log(date);
			console.log(ocurrences);
			googleData.addRow([date, ocurrences]);
		}
	}

	var chart = new google.visualization.AnnotationChart(document.getElementById('calendar-canvas'));
	var options = {
          displayAnnotations: true
        };
	chart.draw(googleData,options);
}

function createDate(dateFormat, date){
	dateArray = date.split(/[^\d\w]+/);
	var date = new Date(dateArray[dateFormat.indexOf("year")],dateArray[dateFormat.indexOf("month")],dateArray[dateFormat.indexOf("day")]);
	return date;
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
	var dateFormat = [];
	for(var i in data){
		var dateArray = data[i][key].split(/[^\d\w]+/);
		if(dateArray.length > 3){
			alert("Couldn't parse date");
			break;
		}
		else if(dateFormat[0] != undefined && dateFormat[1] != undefined && dateFormat[2] != undefined){
			break;
		}
		else{
			for(var j = 0; j < 3; j++){
				if(dateArray[j]>12 && dateArray[j]<31 && dateFormat.indexOf("day") != -1){
					dateFormat[j] = "day";
				}
				else if(dateArray[j] > 31){
					dateFormat[j] = "year";
				}
				else if(dateFormat[j] == undefined && dateFormat.indexOf("day")>=0 && dateFormat.indexOf("year")>=0){
					dateFormat[j] = "month";
				}
			}
		}
	}
	//default
	if(dateFormat.indexOf("day") == -1 || dateFormat.indexOf("month") == -1 || dateFormat.indexOf("year") == -1){
		dateFormat = ["day", "month", "year"];
	}
	return dateFormat;
}
