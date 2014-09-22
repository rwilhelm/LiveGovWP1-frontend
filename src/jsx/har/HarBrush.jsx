/*** @jsx React.DOM */

var HarBrush = React.createClass({
  onBrush: function(brush) {
    this.props.onBrush(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
  },

  componentDidMount: function() {
    var xScale = d3.time.scale().range([0, this.props.width]);
    xScale.domain(this.props.xDomain);

    var brush = d3.svg.brush();
    brush.x(xScale)
      .on('brushend', this.onBrush.bind(this, brush));

    if (this.props.extent.length) {
      brush.extent(this.props.extent);
    } else {
      brush.clear();
    }

    d3.select(this.getDOMNode())
      .call(brush)
      .selectAll('rect')
      .attr('height', '100%');

  },

  render: function() {
    return <g className='harBrush' />;
  }
});
