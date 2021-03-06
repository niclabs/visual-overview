 (function(){
    	var k = 20; // k for top-k values

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

    	d3.select("#go").on("click", function(){
    		d3.select("#headerrow").selectAll("th").remove();
    		d3.select("#row").selectAll("td").remove();
    		var url = d3.select("#url").node().value;
    		d3.csv(url, function(data){
    			if(data == null){
    				alert("Couldn't parse dataset");
    				return;
    			}

    			if(data.length == 0){
    				return;
    			}
    			header = data[0];
    			addPreview(data, 3);
    			d3.select("#tbody").append("tr").attr("id", "row");
   				for(var j in header){
	    			var keys = {};
    				var words = {};
	    			for(var i=0; i<data.length; i++){
    					var row = data[i];
    					var w = row[j].toString().toLowerCase();
    					if(isStopWord(w)){
    						continue;
    					}
    					if(keys[j] ==  undefined){
    						keys[j] = 1;
    					}else{
    						keys[j]++;
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
    				id = j.toLowerCase().replace(" ", "")

    				div = d3.select("#row").append("td").attr("class", "1rowaa").attr("id", id);
    				d3.select("#headerrow").append("th").html(j);
	    			d3.select("#"+id).append("h6").html("Most common values");
	    			wordcloud(topk, id);

	    			histogram = getRandomSample(wordArray, wordArray.length);
	    			d3.select("#"+id).append("h6").html("Sampled histogram");
	    			bar(getTopK(histogram, histogram.length), id)
    			}
    			//console.log(words);
    			//console.log(keys);
    		})
    	})
    })()