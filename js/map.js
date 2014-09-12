function initialize_map(data, columnTypes, header){
	var sample = getRandomSample(data, 200);
	var latKey = getKeyName("latitude", columnTypes, header);
	var longKey = getKeyName("longitude", columnTypes, header);
	var llRegex = /^(\-?\d+(\.\d+)?)/g;
	var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 1
        };

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
