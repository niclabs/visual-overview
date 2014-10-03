/* Data type dictionary. This is manually constructed.
   I'm still trying to think in a better way to do this. */

function determineColumnTypes(header){
	var dataDict = {
		//latitude, longitude
		"latitude":"latitude",
		"latitud":"latitude",
		"lat":"latitude",
		"longitude":"longitude",
		"longitud":"longitude",
		"long":"longitude",
		//dates
		"date":"date",
		"fecha":"date",
	};
	var columnTypes = [];
	for(var i=0; i<header.length; i++){
		var aux = header[i].toLowerCase();
		if(dataDict[aux] != undefined)
			columnTypes[i] = dataDict[aux];
		else if(aux.indexOf("fecha") != -1 || aux.indexOf("date") != -1){
			columnTypes[i]="date";
		}
		else
			columnTypes[i] = "default";
	}
	return columnTypes;
}
