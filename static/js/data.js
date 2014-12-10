/* Falta hacer uno para longitud, pero este sirve para los dos por el momento */
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

function checkLongitude(data, key, position){
	var sample = getRandomSample(data, 200);
	var isLon = false;
	var llRegex = RegExp("^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\.{1}\d{1,6}");
	for(var i=0; i<sample.length; i++){
		rowValue = sample[i][key];
		if(rowValue == undefined || rowValue == ""){
			continue;		
		}
		else if(llRegex.test(rowValue) || llRegex.test(ParseDMS(rowValue.replace("&deg","°")))){
			isLon = true;
			break;
		}
		else{
			break;		
		}
	}
	return isLat;
}


function checkDay(data, key){
	var sample = getRandomSample(data,200);
	var isDay = true;
	for(var i = 0; i<sample.length; i++){
		rowValue = sample[i][key];
		if(rowValue == undefined || rowValue == ""){
			continue;		
		}
		else if(parseInt(rowValue) > 31 || parseInt(rowValue) < 1){
			isDay = false;
			break;		
		}
	}
	return isDay;
}

function checkMonth(data, key){
	var sample = getRandomSample(data, 200);
	var isMonth = true;
	var smonths = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiempte", "octubre", "noviembre", "diciembre"];
	var emonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
	for(var i=0; i<sample.length; i++){
		rowValue = sample[i][key];
		if(rowValue == undefined || rowVale == ""){
			continue;		
		}
		if(smonths.indexOf(rowValue.toLowerCase()) || emonths.indexOf(rowValue.toLowerCase())){
			isMonth = true;
			break;		
		}
		else if(parseInt(rowValue > 12) || parseInt(rowValue < 1)){
			isMonth = false;
			break;
		}
	}
	return isMonth;
}

/* Voy a aceptar fechas desde 1900 hasta el año 2100 */
function checkYear(data, key){
	var sample = getRandomSample(data,200);
	var isYear = true;
	for(var i = 0; i<sample.length; i++){
		rowValue = sample[i][key];
		if(rowValue == undefined || rowValue == ""){
			continue;		
		}
		else if(parseInt(rowValue) > 2100 || parseInt(rowValue) < 1900){
			isYear = false;
			break;		
		}
	}
	return isYear;

}

/* Esta, a diferencia de las otras 3, es para fechas como un todo (ie. dd/mm/yyyy) */
/* El código es el mismo usado para getDateFormat (ubicado en visualizations.js).  */
/* Mas adelante lo cambiaré por algo mas "refinado"                     	   */

function checkDate(data, key){
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
	if(dateFormat == "Error"){
		return false;	
	}
	else{
		return true;
	}
}

function checkNumber(data, key){
	var sample = getRandomSample(data,200);
	var isNum = true;
	for(var i = 0; i<sample.length; i++){
		rowValue = sample[i][key];
		if(rowValue == undefined || rowValue == ""){
			continue;		
		}
		if(isNumber(rowValue.replace("%","").replace("$",""))){
			 isNum= "true";
			break;		
		}
	}
	return isNum;
}

/* No hago un isText, porque TODOS pueden ser considerados texto */
