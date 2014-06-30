/*** @jsx React.DOM */

var Chart = React.createClass({

  render: function() {
    console.log('Chart.jsx:render');
    var label = this.props.dimensions.label;
    var offset = this.props.dimensions.offset;
    return (
      <svg className={this.props.className} transform={offset.svg}>
        <defs />
        <g transform={offset.axis}>
          <text className='x label' text-anchor='end'   x={label.xAxis.x} y={label.xAxis.y}>{label.xAxis.text}</text>
          <text className='y label' text-anchor='start' x={label.yAxis.x} y={label.yAxis.y}>{label.yAxis.text}</text>
          <g className='x axis' transform={offset.xAxis}/>
          <g className='y axis' transform={offset.yAxis}/>
        </g>
        <g clippath='url(#clip)' className='chart' transform={offset.chart}>
          {this.props.children}
        </g>
      </svg>
    );
  },

  componentDidUpdate: function(prevProps, prevState) {
    console.log('Chart.jsx:componentDidUpdate');
    this.clipPath();
    this.axis();
  },

  // append clip path to svg > devs or update it
  clipPath: function() {
    var e = d3.select(this.getDOMNode()).select('defs');

    if (e.select('#clip').empty()) {
      e.append('svg:clipPath').attr('id', 'clip');
    } else if (e.select('#clip').select('rect').empty()) {
      e.select('#clip').append('rect');
    }

    e.select('#clip').select('rect')
      .attr("transform", this.props.dimensions.offset.clipPath)
      .attr("width", this.getDOMNode().offsetWidth - 29)
      .attr("height", this.getDOMNode().offsetHeight - 36);

    e.select('g.chart')
      .attr('clip-path', 'url(#clip)');
  },

  // create x/y-axis on appropiate dom node
  axis: function() {
    var xScale = d3.time.scale().range([0, this.props.dimensions.size.width]);
    xScale.domain(this.props.extent.length ? this.props.extent : this.props.xDomain);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(d3.time.minutes, 1);

    var yScale = d3.scale.linear().range([this.props.dimensions.size.height, 0]);
    yScale.domain(this.props.yDomain);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(Math.max(this.props.dimensions.size.height / 20, 2));

    d3.select(this.getDOMNode()).select('.x.axis').call(xAxis);
    d3.select(this.getDOMNode()).select('.y.axis').call(yAxis);
  },

});
