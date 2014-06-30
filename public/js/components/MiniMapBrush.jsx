/*** @jsx React.DOM */

var MiniMap = React.createClass({
  render: function() {
    return (
      <div id="minimap">
        <svg>
          <g id="minimap" className='brush' />
        </svg>
      </div>
    );
  },

  componentDidMount: function() {
    console.log('MiniMapBrush.jsx:componentDidMount');
    this.updateBrush();
  },

  onBrushend: function(brush) {
    console.log('MiniMapBrush.jsx:onBrushend');
    this.props.onBrush(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
  },

  onBrush: function(brush) {
    console.log('MiniMapBrush.jsx:onBrush');
    this.props.onBrush(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
  },

  getDefaultProps: function() {
    return {
      dimensions: {
        size: {
          width: 1440,
          height: 50
        }
      }
    };
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
      .on("brush",    this.onBrush.bind(this, brush))
      .on("brushend", this.onBrushend.bind(this, brush));

    if (this.props.extent.length) {
      brush.extent(this.props.extent);
    } else {
      brush.clear();
    }

    d3.select(this.getDOMNode())
      .call(brush)
      .selectAll("rect")
      .attr("height", 50);
  },

});
