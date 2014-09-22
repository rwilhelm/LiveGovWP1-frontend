/*** @jsx React.DOM */

var HarBar = React.createClass({
  render: function() {
    var xScale = d3.time.scale().range([0, this.props.width]);
    xScale.domain(this.props.xDomain);

    var x = 0;
    var rects = this.props.data.map(function(c, i, a) {
      var width = xScale(c.stop) - xScale(c.start);
      var tag = c.tag;
      var rect = <g key={i}><rect className={tag} x={x} width={width} y='0' height='100%' /><title>{tag}</title></g>;
      x = x + width;
      return rect;
    });

    return <g>{rects}</g>;
  }
});
