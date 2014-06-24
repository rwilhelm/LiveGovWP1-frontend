/*** @jsx React.DOM */

var Brush = React.createClass({
  loadMoreData: function(extent) {
    // this.setState({ extent: extent });
    console.log('Brush.jsx:loadMoreData' + this.props.sensor);
    this.props.loadMoreData(extent);
    // return this.props.loadMoreData(extent, this.props.extent);
  },

	componentDidMount: function() {
    var xScale = d3.time.scale()
      .range([0, this.props.size.width]);

    var yScale = d3.scale.linear()
      .range([this.props.size.height, 0]);

    xScale.domain(this.props.extent.length ? this.props.extent : this.props.xDomain);
    yScale.domain(this.props.yDomain);

		var brush = d3.svg.brush();
    var chart = d3.select(this.getDOMNode());

    brush.x(xScale)
      .on("brushend", this.brushended.bind(this, brush));
      // .on("brushend", this.brushended.bind(this, brush));

    if (this.props.extent.length) {
      brush.extent(this.props.extent);
    } else {
      brush.clear();
    }

    var gBrush = chart.append("g")
      .attr("class", "brush")
      .call(brush)
      .selectAll("rect")
      .attr("height", this.props.size.height - 72); // TODO
	},

  brushended: function(brush) {
    this.loadMoreData(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
    d3.selectAll('chart').select('.brush').call(brush.clear());
  },

	render: function() {
		return (
			<g />
		);
	}
});
