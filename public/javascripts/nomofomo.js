d3.select("#bubblegraph_zoom_in").on("click", function(){});
d3.select("#bubblegraph_zoom_out").on("click", function(){});

// The bubble graph UI object

function BubbleGraphObject(svgSelector) {
  this.svg = d3.select(svgSelector);
  this.data = null
}

BubbleGraphObject.prototype.setData = function(d) {
  this.data = d;
  var to = d3.max(d, function(v){ return v.publishedAt; })
  var from = to - 86400000*7;
  this.zoomToRange(from, to);
}

BubbleGraphObject.prototype.zoomIn = function() {
  var span = this.to - this.from, midpoint = (this.from + this.to)/2;
  var nfrom = midpoint - span/4;
  var nto = midpoint + span/4;
  this.zoomToRange(nfrom, nto)
}

BubbleGraphObject.prototype.zoomOut = function() {
  var span = this.to - this.from, midpoint = (this.from + this.to)/2;
  var nfrom = midpoint - span;
  var nto = midpoint + span;
  this.zoomToRange(nfrom, nto)
}

BubbleGraphObject.prototype.zoomToRange = function(from, to) {
  this.from = from
  this.to = to
  var fromDate = new Date(from);
  var toDate = new Date(to);
  var pixelsPerNanosec = 1100.0/(to-from);
  var markerGap = 50
  var nanosecsPerMarkerGap = ((to-from)/600.0)*markerGap;

  var startMarker = from
  var markerIncrement = 1
  var markerFmt = null
  var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // choose the right scale for markers
  if ((nanosecsPerMarkerGap) <= 3600000) {
    // 1 hour
    markerIncrement = 3600000;
    markerFmt = function(d){ return d.getHours()+":00"; }
  } else if ((nanosecsPerMarkerGap <= 86400000)) {
    markerIncrement = 86400000;
    markerFmt = function(d){ return d.getDate()+" "+monthName[d.getMonth()]; }
  } else if ((nanosecsPerMarkerGap <= 2628000000)) { // roughly a month
    markerIncrement = 2628000000
    markerFmt = function(d){ return monthName[d.getMonth()]+" "+d.getFullYear(); }
  } else {
    markerIncrement = 31536000000 
    while(nanosecsPerMarkerGap > markerIncrement) markerIncrement *= 10;
    markerFmt = function(d){ return d.getFullYear()+"" }
  }
  startMarker = Math.ceil((from-1)/markerIncrement)*markerIncrement


  var markers = [];
  for(var i=startMarker; i <= to; i += markerIncrement) {
    markers.push(i);
  }
  console.log("markers = "+markers);

  var data = this.data.filter(function(v){return (v.publishedAt>=from && v.publishedAt<=to);});
  var svg = this.svg;
  var circles = this.svg.selectAll("circle").data(data, function(d){return d.url;})
  circles.enter().append("circle")
    .attr("cx", function(d,i){return (d.publishedAt-from)*pixelsPerNanosec;})
    .attr("r", function(d){return d.importance*8;})
    .attr("fill", function(d){return '#' + Math.round(d.importance).toString(10) +'ff';})
    .attr("opacity", 0.7)
    .attr("cy", 100)
    .on("mouseover", function(d, i){
      var cr = svg[0][0].getBoundingClientRect();
      d3.select(this).transition().attr("r", d.importance*14);
      var infobox = d3.select("#bubbleinfo");
      d3.select("#bubbleinfo__title").text(d.headline);
      d3.select("#bubbleinfo__views").text(d.viewCount);
      d3.select("#bubbleinfo__likes").text(d.facebookLikeCount);
      d3.select("#bubbleinfo__comments").text(d.commentCount);
      d3.select("#bubbleinfo__fb").text(d.facebookShareCount);
      d3.select("#bubbleinfo__twitter").text(d.twitterShareCount);
      //d3.select("#bubbleinfo__thumb").src(d.thumbnail);
      infobox.style("display", "block")
        //.style("left", (cr.left + i*30 - 10))
        .style("left", (d.publishedAt-from)*pixelsPerNanosec - 40)

        .style("top", cr.top+200);
      infobox.transition().style("opacity", "1.0");
    })
    .on("mouseout", function(d, i){
      d3.select(this).transition().attr("r", d.importance*12);
      var infobox = d3.select("#bubbleinfo");
      infobox.transition().style("opacity", "0.0");
      //infobox.style("display", "none")
    })
    .on("click", function(d){
      window.location.href = d.url;	
    });
  circles.transition().duration(300)
    .attr("cx", function(d,i){return (d.publishedAt-from)*pixelsPerNanosec;})
    .attr("r", function(d){return d.importance*12;})
    .attr("fill", function(d){return '#0' + Math.round(d.importance * 1.6 -1).toString(16) +'7';});
  circles.exit().remove();
  var dashes = this.svg.selectAll("rect.marker").data(markers, function(d){return d;});
  dashes.enter()
    .append("rect")
      .attr("class", "marker")
      .attr("x", function(d,i) { return (d-from)*pixelsPerNanosec; })
      .attr("y", 180)
      .attr("width", 2)
      .attr("height", 10)
      .attr("fill", "#777")
      .attr("id", function(d){return "mkr"+d;});
  dashes.transition().duration(300)
    .attr("x", function(d,i) { return (d-from)*pixelsPerNanosec; });			
  dashes.exit().remove();

  var labels = this.svg.selectAll("text.marker").data(markers, function(d){return d;});
  labels.enter()
    .append("text")
      .attr("class", "marker")
      .attr("dx", function(d,i) { return (d-from)*pixelsPerNanosec; })
      .text(function(d){return markerFmt(new Date(d)); })
      .attr("dy", 190);
  labels.transition().duration(300)
      .attr("dx", function(d,i) { return (d-from)*pixelsPerNanosec; });
  labels.exit().remove();

}

var graph = new BubbleGraphObject("#bubblegraph_svg");
$.ajax(ajaxUrl, {
  success: function(data) {
    console.log(data);
    graph.setData(data);
  }
});

//graph.zoomToRange(1424131200, 1424973600);

d3.select("#bubblegraph_zoom_in").on("click", function(){graph.zoomIn();});
d3.select("#bubblegraph_zoom_out").on("click", function(){graph.zoomOut();});
