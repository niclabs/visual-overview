function initialize_map(data, n){
	console.log(data);
	var mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 1
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	
	for(var i=0; i<n; i++){
		var myLatlng = new google.maps.LatLng(data[i]["Latitude"],data[i]["Longitude"]);
		var marker = new google.maps.Marker({
    		position: myLatlng,
    		title:"Hello World!"
		});
		marker.setMap(map)
	}

}
