/*** @jsx React.DOM */

var Circle = React.createClass({

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

	render: function() {
    var cx = this.props.cx;
    var cy = this.props.cy;
    var r = this.props.r;
    var offset = this.props.offset;
		return (
			<circle pos={pos}/>
		);
	}
});