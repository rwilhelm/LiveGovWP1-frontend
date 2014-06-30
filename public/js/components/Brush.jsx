/*** @jsx React.DOM */

var Brush = React.createClass({
  render: function() {
    console.log('Brush.jsx:render');
    console.info(this.props.dimensions);
    return (
      <g className='brush' />
    );
  },

  componentDidUpdate: function() {
    console.log('Brush.jsx:componentWillUpdate');
    this.updateBrush();
  },

  onBrushend: function(brush) {
    console.log('Brush.jsx:onBrushend');
    this.props.onBrush(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
    d3.selectAll('.brush').call(brush.clear());
  },

  updateBrush: function() {
    var xScale = d3.time.scale()
      .range([0, this.props.dimensions.size.width]);

    var yScale = d3.scale.linear()
      .range([this.props.dimensions.size.height, 0]);

    var hasExtent = !!this.props.extent.length;
    xScale.domain(hasExtent ? this.props.extent : this.props.domain.x);
    yScale.domain(this.props.domain.y);

    var brush = d3.svg.brush();
    brush.x(xScale)
      .on("brushend", this.onBrushend.bind(this, brush));

    if (this.props.extent.length) {
      brush.extent(this.props.extent);
    } else {
      brush.clear();
    }

   d3.select(this.getDOMNode())
     .call(brush)
     .selectAll("rect")
     .attr("height", this.props.dimensions.size.height + 4);
  },

});
