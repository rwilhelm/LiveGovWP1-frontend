/*** @jsx React.DOM */

var Circles = React.createClass({

	renderCircles: function() {
	  var colors = ['#1d1f21', '#dc143c', '#1e90ff'];
    map.canvas.circles = function() {
      ['x', 'y', 'z'].forEach(function(c,i,a) {
        data.forEach(function(d) {
          map.canvas.beginPath();
          var cx = xScale(d.ts) + margin.left;
          var cy = yScale(d[c]) + margin.top;
          var r = 2;
          map.canvas.moveTo(cx, cy);
          map.canvas.arc(cx, cy, r, 0, 2 * Math.PI);
          map.canvas.lineWidth = 0.2;
          // map.canvas.strokeStyle = colors[i];
          map.canvas.fillStyle = colors[i];
          // map.canvas.stroke();
          map.canvas.fill();
        });
      });
    }
	},

	renderSVGCircles: function() {
    // x-value circles
    svg.selectAll("line0")
      .data(data)
      .enter()
      .append("svg:circle")
      .attr("clip-path", "url(#clip)")
      .attr("transform", "translate(" + chartOffset + ")")
      .attr("cx", function(d) { return xScale(d.ts); })
      .attr("cy", function(d) { return yScale(d.x); })
      .attr("r", circleRadius)
      .attr("class", "circle circle0");
	},

	render: function() {

    var r = 1.2;
    var offset = this.props.offset;
   	var circles = this.props.data.map(function(d,i) {
   		return (
 			  <circle key={i} transform={offset} cx={d[0]} cy={d[1]} r={r} className="circle"/>
   		)
   	});

		return (
			<g classed='circles'>{circles}</g>
		);
	}
});