/*** @jsx React.DOM */

var Paths = React.createClass({
  getDefaultProps: function() {
    return {
      path: '',
      color: 'blue',
      width: 2
    };
  },
  render: function() {
    var path = d3.svg.line()
      .x(function(d) { return this.props.xScale(d.x); })
      .y(function(d) { return this.props.yScale(d.y); })
      .interpolate(this.props.interpolate);

    return (
      <path d={this.props.path} stroke={this.props.color} strokeWidth={this.props.width} fill='none' />
    )
  }
});
