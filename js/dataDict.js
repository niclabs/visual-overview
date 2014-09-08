/* Data type dictionary. This is manually constructed.
   I'm still trying to think in a better way to do this. */

function determineColumnTypes(header){
	var dataDict = {
		"latitude":"latitude",
		"latitud":"latitude",
		"lat":"latitude",
		"longitude":"longitude",
		"longitud":"longitude",
		"long":"longitude"
	};
	var columnTypes = [];
	for(var i=0; i<header.length; i++){
		var aux = header[i].toLowerCase();
		if(dataDict[aux] == undefined)
			columnTypes[i] = "default";
		else
			columnTypes[i] = dataDict[aux];
	}
	return columnTypes;
}
