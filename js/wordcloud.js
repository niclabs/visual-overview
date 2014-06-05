function wordcloud(words, id){
 var fill = d3.scale.category20();

/*[
        "Hello", "world", "normally", "you", "want", "more", "words",
        "than", "this"].map(function(d) {
        return {text: d, size: 10 + Math.random() * 90};
      })
*/
  var w = 200, h = 200;
  var maxValue = Math.max.apply(null, words.map(function(d){return d.size}));
  var maxFont = 20;
  d3.layout.cloud().size([w, h])
      .words(words)
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return maxFont*(d.size/maxValue); })
      .on("end", draw)
      .start();

  function draw(words) {
    d3.select("#"+id).append("svg")
        .attr("width", w)
        .attr("height", h)
      .append("g")
        .attr("transform", "translate("+(w/2)+","+(h/2)+")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Helvetica Neue")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }
}