/*** @jsx React.DOM */

var Chart = React.createClass({
  propTypes: {
    // size.width: React.PropTypes.number.isRequired,
    // size.height: React.PropTypes.number.isRequired,
    // offset.y: React.PropTypes.number.isRequired,
    // offset.x: React.PropTypes.number.isRequired
  },
  componentDidMount: function() {
    console.info('Chart:componentDidMount', this.props.extent);
    var xScale = d3.time.scale()
      .range([0, this.props.size.width]);

    var yScale = d3.scale.linear()
      .range([this.props.size.height, 0]);

    xScale.domain(this.props.extent.length ? this.props.extent : this.props.xDomain);
    yScale.domain(this.props.yDomain);

    var xAxis = d3.svg.axis().scale(xScale)
      .orient("bottom")
      .ticks(d3.time.minutes, 1);

    var yAxis = d3.svg.axis().scale(yScale)
      .orient("left")
      .ticks(Math.max(this.props.size.height / 25, 2));

    var chart = d3.select(this.getDOMNode().children[0]);

    // x-axis
    chart
      .append('g')
        .attr("class", "x axis")
        .attr("transform", this.props.offset.x)
        .call(xAxis);

    // y-axis
    chart
      .append("g")
        .attr("class", "y axis")
        .attr("transform", this.props.offset.y)
        .call(yAxis);

    // x-label
    chart
      .append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", this.props.axisLabel.xAxis.x)
        .attr("y", this.props.axisLabel.xAxis.y)
        .text(this.props.axisLabel.xAxis.text);

    // y-label
    chart
    .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "start")
      .attr("x", this.props.axisLabel.yAxis.x)
      .attr("y", this.props.axisLabel.yAxis.y)
      .text(this.props.axisLabel.yAxis.text);
  },
  componentWillUpdate: function(nextProps, nextState) {
    console.log('Chart.jsx:componentWillUpdate', nextProps, nextState);
  },
  render: function() {
    console.info('Chart:render', this.props);

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
