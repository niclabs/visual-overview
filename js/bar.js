function bar(words, id){
 var fill = d3.scale.category20();

 var w = 200, h = 200;
 var maxValue = Math.max.apply(null, words.map(function(d){return d.size}));

 var svg = d3.select("#"+id).append("svg")
 .attr("width", w)
 .attr("height", h);

 var bigG  = svg.append("g");
 var tooltip = svg.append("text").attr("x", w/2).attr("y", 20);
 g = bigG.selectAll(".bar").data(words).enter().append("g");
 g.append("rect").on("mouseover", function(){
                          tooltip.text(d3.select(this).attr("text")).attr("x", (w)/2);
                          d3.select(this).style("fill", "orangered");
                }).on("mouseout", function(){
                          tooltip.text("");
                          d3.select(this).style("fill", "steelblue");
                }).attr("x", function(d, i){return (i*w)/words.length})
                  .attr("y", function(d){return h*(1-(d.size/maxValue))})
                  .attr("height", h)
                  .attr("width", w/words.length)
                  .attr("class", "bar")
                  .attr("text", function(d){return d.text+" ("+d.size+")"});
/*g.append("text").text(function(d){return d.text})
//.attr("x", function(d, i){return (i*w)/words.length + 0.5*w/words.length})
//.attr("y", h/2)
.attr("transform", function(d, i){
  newW = (i*w)/words.length + 0.5*w/words.length;
  newH  =h-5;
  return "translate("+newW+","+newH+")rotate(270)"});
*/
// .text(function(d) { return d.text; });
}