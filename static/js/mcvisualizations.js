function mc_visualize(checkedKeys, visualization, data){
	if(visualization == "Time Series"){
		drawMCCalendar(data, checkedKeys);
	}
}					

function drawMCCalendar(data, checkedKeys){
	var dayKey;
	var monthKey;
	var yearKey;
	// First check for year
	for(var i = 0; i<checkedKeys.length; i++){
		if(checkYear(data,checkedKeys[i])){
			yearKey = checkedKeys[i];
			break;		
		}
	}
	// Next check for month
	for(var i = 0; i<checkedKeys.length; i++){
		if(checkMonth(data,checkedKeys[i]) && checkedKeys[i] != yearKey){
			monthKey = checkedKeys[i];
			break;		
		}
	}
	// Finally check for year
	for(var i = 0; i<checkedKeys.length; i++){
		if(checkDay(data,checkedKeys[i]) && checkedKeys[i] != yearKey && checkedKeys[i] != monthKey){
			dayKey = checkedKeys[i];
			break;		
		}
	}
	
	// And make sure neither of the keys is undefined
	if(dayKey == undefined || monthKey == undefined || yearKey == undefined){
		alert("One or more columns couldn't be parsed");
		return;	
	}
	
	//start to visualize
	var googleData = new google.visualization.DataTable();
	var canvas = $("#checkedvisualization");
	var dateArray = [];
	var comparedDates = [];

	googleData.addColumn('date', 'Date');
	googleData.addColumn('number', 'Ocurrences');
	
	// Create dateArray
	for(var i in data){
		date = new Date(data[i][yearKey], data[i][monthKey], data[i][dayKey]);
		dateArray.push(date);
	}
	// Count Occurrences
	for(var i in dateArray){
		date = dateArray[i];
		if(comparedDates.indexOf(date.getTime()) != -1){
			continue;		
		}
		googleData.addRow([date, countOcurrences(date, dateArray)]);
		comparedDates.push(date.getTime());
	}
	var chart = new google.visualization.AnnotationChart(document.getElementById("checkedvisualization"));
	var options = {
		displayAnnotations: true
        };
	chart.draw(googleData, options);
	
}

function countOcurrences(date, dateArray){
	var occurrences = 0;
	for(var i in dateArray){
		if(date.getTime() == dateArray[i].getTime()){
			occurrences++;
		}
	}
	return occurrences;
}
