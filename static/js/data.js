function checkLatitude(data, key, position){
	var sample = getRandomSample(data, 200);
	var isLat = false;
	var llRegex = RegExp("^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}");
	for(var i=0; i<sample.length; i++){
		rowValue = sample[i][key];
		if(rowValue == undefined || rowValue == ""){
			continue;		
		}
		else if(llRegex.test(rowValue) || llRegex.test(ParseDMS(rowValue.replace("&deg","°")))){
			isLat = true;
			break;
		}
		else{
			break;		
		}
	}
	return isLat;
}

