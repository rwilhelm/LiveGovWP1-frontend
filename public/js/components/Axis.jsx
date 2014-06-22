/*** @jsx React.DOM */

var Axis = React.createClass({
  getDefaultProps: function() {
    return {
      x: 1209,
      y: 120,
      anchor: 'end',
      axis: 'x',
      class: 'x axis',
      text: 'time'
    };
  },
  // componentDidMount: function() {
  //   debugger
  //   return {
  //     x: this.getDOMNode().offsetWidth,
  //     y: this.getDOMNode().offsetHeight
  //   };
  // },
      // x-axis
    // chart.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0," + (height + 3) + ")") // ?
    //   .call(xAxis);

  xAxis: function() {
  },

  render: function() {

    // function xAxis() {
    //   return d3.svg.axis().scale(xScale).orient("bottom").ticks(Math.max(width / 75, 2));
    // }

    var xScale = d3.time.scale().range([0, this.props.width]);
    var yScale = d3.scale.linear().range([this.props.height, 0]);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(Math.max(this.props.width / 75, 2));
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(Math.max(this.props.height / 25, 2));

    return (
      d3.select(this.getDOMNode())
        .attr("class", "axis")
        .attr("transform", "translate(0," + (this.props.height + 3) + ")") // ?
        .call(this.xAxis)
    );
  }
})
