/*** @jsx React.DOM */

var Chart = React.createClass({
  propTypes: {
    // size.width: React.PropTypes.number.isRequired,
    // size.height: React.PropTypes.number.isRequired,
    // offset.y: React.PropTypes.number.isRequired,
    // offset.x: React.PropTypes.number.isRequired
  },

  getDefaultProps: function() {
    var xScale = d3.time.scale().range([0, this.props.size.width]);
    var yScale = d3.scale.linear().range([this.props.size.height, 0]);

    return {
      xDomain: xScale.domain(this.props.extent.length ? this.props.extent : this.props.xDomain),
      yDomain: yScale.domain(this.props.yDomain),
      xAxis: d3.svg.axis().scale(xScale).orient("bottom").ticks(d3.time.minutes, 1),
      yAxis: d3.svg.axis().scale(yScale).orient("left").ticks(Math.max(this.props.size.height / 25, 2)),
    };
  },

  appendAxis: function(domNode) {
    domNode.selectAll('.axis').remove();

    // x-axis
    domNode
      .append('g')
        .attr("class", "x axis")
        .attr("transform", this.props.offset.x)
        .call(this.props.xAxis);

    // y-axis
    domNode
      .append("g")
        .attr("class", "y axis")
        .attr("transform", this.props.offset.y)
        .call(this.props.yAxis);
  },

  appendLabels: function(domNode) {
    domNode.selectAll('.label').remove();

    // x-label
    domNode
      .append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", this.props.axisLabel.xAxis.x)
        .attr("y", this.props.axisLabel.xAxis.y)
        .text(this.props.axisLabel.xAxis.text);

    // y-label
    domNode
      .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "start")
        .attr("x", this.props.axisLabel.yAxis.x)
        .attr("y", this.props.axisLabel.yAxis.y)
        .text(this.props.axisLabel.yAxis.text);
  },

  appendClipPath: function(domNode) {
    domNode.selectAll('#clip-path').remove();

    domNode
      .append("clipPath")
        .attr("id", "clip")
        .append("rect")
          .attr("width", this.props.size.width)
          .attr("height", this.props.size.height);

  },

  componentDidMount: function() {
    console.info('Chart:componentDidMount' + this.props.sensor);
    var svg = d3.select(this.getDOMNode());
    var chart = d3.select(this.getDOMNode().children[0]);
    this.appendAxis(chart);
    this.appendLabels(chart);
    this.appendClipPath(svg);
  },
  componentWillUpdate: function(nextProps, nextState) {
    console.log('Chart:componentWillUpdate' + this.props.sensor);
    var chart = d3.select(this.getDOMNode().children[0]);
    this.appendAxis(chart)
    this.appendLabels(chart);
  },
  render: function() {
    console.info('Chart:render' + this.props.sensor);

    var offset = this.props.offset;
    var size = this.props.size;

    return (
      <svg size={size}>
        <g transform={offset.g}>
          {this.props.children}
        </g>
      </svg>
    );
  }
});
