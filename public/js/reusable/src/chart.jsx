/** @jsx React.DOM */
var chart = React.createClass({
  // http://facebook.github.io/react/docs/component-specs.html

  // getDefaultProps: function() {
  //   // console.info('chart component: getDefaultProps', this.props);
  // },

  getInitialState: function() {
    // console.info('chart component: getInitialState', this.props);
    return {extent: []};
  },

  // propTypes: {},

  // mixins: {},

  // statics: {},

  // componentWillMount: function() {
  //   // console.info('chart component: componentWillMount', this.props);
  // },

  componentDidMount: function() {
    // console.info('chart component: componentDidMount', this.props);
    if (this.props.data) {
      this.renderChart(this.props.data);
    }
  },

  // componentWillReceiveProps: function(nextProps) {
  //   // console.info('chart component: componentWillReceiveProps', this.props, nextProps);
  //   // if (nextProps.data) {
  //   //   this.renderChart(nextProps.data);
  //   // }
  // },

  // first after brushended
  shouldComponentUpdate: function(nextProps, nextState) {
    // console.info('chart component: shouldComponentUpdate', this.props, nextProps, nextState);
    return (this.props.extent !== nextState.extent);
  },

  // second after brushended (if shouldComponentUpdate returns true)
  // componentWillUpdate: function(nextProps, nextState) {
  //   // console.info('chart component: componentWillUpdate', this.props, nextProps, nextState);

  //   // nextProps.extent = nextState.extent;
  //   // this.getDOMNode().parentNode.setAttribute('extent', '[' + nextState.extent + ']');
  // },

  // third after brushended (triggers renderChart)
  componentDidUpdate: function(prevProps, prevState) {
    // console.info('chart component: componentDidUpdate', this.props, prevProps, prevState);
    this.renderChart(prevProps.data);
  },

  // componentWillUnmount: function() {
  //   // console.info('chart component: componentWillUnmount', this.props);
  // },

  renderChart:function() {
    // console.info('chart component: renderChart', this.props);
    var margin = {top: 2, right: 1, bottom: 21, left: 24 },
      width = this.getDOMNode().offsetWidth - margin.left - margin.right,
      height = 230,
      xScale = d3.time.scale().range([0, width]),
      yScale = d3.scale.linear().range([height, 0]),
      xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(Math.max(width / 75, 2)),
      yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(Math.max(height / 25, 2)),
      brush = d3.svg.brush();

    var data = this.props.data;
    var chartName = this.props.sensor;
    var extent = this.props.extent;
    var xDomain = this.props.xDomain;
    var yDomain = this.props.yDomain;
    var element = this.getDOMNode();

    var chartWidth = width + margin.left + margin.right;
    var chartHeight = height + margin.top + margin.bottom;

    xScale.domain(extent.length ? extent : xDomain);
    yScale.domain(yDomain);

    var line = d3.svg.line().interpolate("linear")
      .x(function(d) { return xScale(d[0]); }) // String timestamp
      .y(function(d) { return yScale(d[1]); }); // Number value

    if (d3.select(element).select('svg').empty()) {
      d3.select(element)
        .append('svg')
          .classed('chart', true)
          .attr("width", chartWidth)
          .attr("height", chartHeight)
        .append("defs")
        .append("clipPath")
          .attr("id", "clip")
        .append("rect")
          .attr("width", chartWidth)
          .attr("height", chartHeight);
    }

    // remove old charts from svg element
    d3.select(element).select('svg').selectAll("g.chart").remove();
    d3.select(element).select('svg').selectAll("text").remove();
    d3.select(element).select('svg').selectAll("circle").remove();

    // select svg element
    var svg = d3.select(element).select('svg').data(data);

    var translate = function(x, y) {
      return (margin.left + x) + "," + (margin.top + y);
    };

    var chartOffset = translate(0, 0);
    var circleRadius = 1.5;

    var chart = svg.append("g")
      .attr("transform", "translate(" + chartOffset + ")")
      .attr("class", "chart");

    // x-axis
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height + 3) + ")") // ?
      .call(xAxis);

    // y-axis
    chart.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-3," + margin.top + ")") // ?
      .call(yAxis);

    // x-axis label
    chart.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height)
      .text("time");

    // y-axis label
    chart.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "start")
      .attr("x", 0)
      .attr("y", (10 - 3)) // font size - axis shift
      .text("sensor value");

    // x-value line
    chart.append("path")
      .attr("class", "line line0")
      .attr("clip-path", "url(#clip)")
      .attr("d", line(data.map(function(d) { return [d.ts, d.x]; })));

    // x-value circles
    svg.selectAll("line0")
      .data(data)
      .enter()
      .append("svg:circle")
      .attr("clip-path", "url(#clip)")
      .attr("transform", "translate(" + chartOffset + ")")
      .attr("cx", function(d) { return xScale(d.ts); })
      .attr("cy", function(d) { return yScale(d.x); })
      .attr("r", circleRadius)
      .attr("class", "circle circle0");

    // y-value line
    chart.append("path")
      .attr("class", "line line1")
      .attr("clip-path", "url(#clip)")
      .attr("d", line(data.map(function(d) { return [d.ts, d.y]; })));

    // y-value circles
    svg.selectAll("line1")
      .data(data)
      .enter().append("svg:circle")
      .attr("clip-path", "url(#clip)")
      .attr("transform", "translate(" + chartOffset + ")")
      .attr("cx", function(d) { return xScale(d.ts); })
      .attr("cy", function(d) { return yScale(d.y); })
      .attr("r", circleRadius)
      .attr("class", "circle circle1");

    // z-value line
    chart.append("path")
      .attr("class", "line line2")
      .attr("clip-path", "url(#clip)")
      .attr("d", line(data.map(function(d) { return [d.ts, d.z]; })));

    // z-value circles
    svg.selectAll("line2")
      .data(data)
      .enter().append("svg:circle")
      .attr("clip-path", "url(#clip)")
      .attr("transform", "translate(" + chartOffset + ")")
      .attr("cx", function(d) { return xScale(d.ts); })
      .attr("cy", function(d) { return yScale(d.z); })
      .attr("r", circleRadius)
      .attr("class", "circle circle2");

    // brush
    brush.x(xScale)
      .on("brushend", brushended);

    var gBrush = chart.append("g")
      .attr("class", "brush")
      .call(brush)
      .selectAll("rect")
      .attr("height", height);

    var that = this; // FIXME
    function brushended() {
      that.loadMoreData(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
      // that.setState({extent: brush.empty() ? [] : brush.extent().map(function(d) { return +d; })});
      // dispatch.brushended(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
      d3.selectAll('chart').select('.brush').call(brush.clear());
    }
  },

  loadMoreData: function(extent) {
    this.setState({ extent: extent });
    console.log('chart component: loadMoreData', extent);
    return this.props.loadMoreData(extent, this.props.extent);
  },

  render: function() {
    // console.info('chart component: render', this.props);
    return React.DOM.div();
  }
});
