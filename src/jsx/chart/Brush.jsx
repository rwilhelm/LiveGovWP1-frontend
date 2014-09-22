/*** @jsx React.DOM */

var Brush = React.createClass({
  render: function() {
    return (
      <g className='brush' />
    );
  },

  componentDidUpdate: function() {
    this.updateBrush();
  },

  updateBrush: function() {
    var xScale = d3.time.scale()
      .range([0, this.props.width]);

    var hasExtent = !!this.props.extent.length;
    xScale.domain(hasExtent ? this.props.extent : this.props.xDomain);

    var brush = d3.svg.brush();
    brush.x(xScale)
      .on('brushend', this.onBrushend.bind(this, brush));

   d3.select(this.getDOMNode())
     .call(brush)
     .selectAll('rect')
     .attr('height', this.props.height);
  },

  onBrushend: function(brush) {
    // console.log('brush extent', brush.extent().map(function(d) { return +d; }));
    this.props.onBrush(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
    d3.selectAll('.brush').call(brush.clear());
  },
});
