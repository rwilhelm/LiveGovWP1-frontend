/** @jsx React.DOM */
var chart =
  React.createClass({
    // http://facebook.github.io/react/docs/component-specs.html

    getDefaultProps: function() {
      // console.info('chart component: getDefaultProps', this.props);
    },

    getInitialState: function() {
      // console.info('chart component: getInitialState', this.props);
      return {};
    },

    propTypes: {},

    mixins: {},

    statics: {},

    componentWillMount: function() {
      // console.info('chart component: componentWillMount', this.props);
    },

    componentDidMount: function() {
      // console.info('chart component: componentDidMount', this.props);
      if (this.props.data) {
        this.renderChart(this.props.data);
      }
    },

    componentWillReceiveProps: function(nextProps) {
      // console.info('chart component: componentWillReceiveProps', this.props, nextProps);
      if (nextProps.data) {
        this.renderChart(nextProps.data);
      }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      // console.info('chart component: shouldComponentUpdate', this.props, nextProps, nextState);
    },

    componentWillUpdate: function(nextProps, nextState) {
      // console.info('chart component: componentWillUpdate', this.props, nextProps, nextState);
      if (nextProps.data) {
        console.log('nextProps.data', nextProps.data);
        this.renderChart(nextProps.data);
      } else {
        console.log('no data :/');
      }
    },

    componentDidUpdate: function(prevProps, prevState) {
      // console.info('chart component: componentDidUpdate', this.props, prevProps, prevState);
      if (prevProps.data) {
        console.log('prevProps.data', prevProps.data);
        this.renderChart(prevProps.data);
      } else {
        console.log('no data :/');
      }
    },

    componentWillUnmount: function() {
      // console.info('chart component: componentWillUnmount', this.props);
    },

    renderChart:function() {
      console.log('chart component: renderChart', this.props);
      console.log(this.getDOMNode().offsetWidth - 25);
      var margin = {top: 2, right: 1, bottom: 21, left: 24 }, // FIXED!
        width = this.getDOMNode().offsetWidth - margin.left - margin.right,
        height = 120,
        xScale = d3.time.scale().range([0, width]),
        yScale = d3.scale.linear().range([height, 0]),
        xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(Math.max(width / 75, 2)),
        yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(Math.max(height / 25, 2)),
        brush = d3.svg.brush(),
        extent;

      var dispatch = d3.dispatch('brushended'); // exposed functions

      var data = this.props.data;
      var chartName = this.props.target;
      var element = '#' + this.props.target;
      var extent = this.props.extent;

      if (this.props.extent) {
        xScale.domain(this.props.extent)
      } else {
        console.warn('WARNING! NO EXTENT SET! YOUR CHART PATHS WILL BE SCREWED UP.');
      }

      if (this.props.yDomain) {
        yScale.domain(this.props.yDomain);
      }

      var line = d3.svg.line().interpolate("linear")
        .x(function(d) {
          return xScale(d[0]); // String timestamp
        })
        .y(function(d) {
          return yScale(d[1]); // Number value
        });

      console.log('element', element);
      if (d3.select(element).select('svg').empty()) {
        d3.select(element)
          .append('svg')
            .classed('chart', true)
            .classed(chartName, true)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("defs")
          .append("clipPath")
            .attr("id", "clip")
          .append("rect")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
      }

      // remove old charts from svg element
      d3.select(element).select('svg').selectAll("g.chart").remove();
      d3.select(element).select('svg').selectAll("text").remove();
      d3.select(element).select('svg').selectAll("circle").remove();

      // select svg element
      var svg = d3.select(element).select('svg').data(data);

      var chart = svg.append("g")
        .attr("transform", "translate(" + (margin.left + 0) + "," + (margin.top + 0) + ")")
        .attr("class", "chart");

      chart.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height)
        .text("time");

      chart.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "start")
        .attr("x", 0)
        .attr("y", (10 - 3)) // font size - axis shift
        .text("sensor value");

      // x-graph
      chart.append("path")
        .attr("class", "line line0")
        .attr("clip-path", "url(#clip)")
        .attr("d", line(data.map(function(d) { return [d.ts, d.x]; })));

      svg.selectAll("line0")
        .data(data)
        .enter()
        .append("svg:circle")
        .attr("transform", "translate(" + (margin.left + 0) + "," + (margin.top + 0) + ")")
        .attr("cx", function(d) { return xScale(d.ts); })
        .attr("cy", function(d) { return yScale(d.x); })
        .attr("r", 1.5)
        .attr("class", "circle circle0");

      // y-graph
      chart.append("path")
        .attr("class", "line line1")
        .attr("clip-path", "url(#clip)")
        .attr("d", line(data.map(function(d) { return [d.ts, d.y]; })));

      svg.selectAll("line1")
        .data(data)
        .enter().append("svg:circle")
        .attr("transform", "translate(" + (margin.left + 0) + "," + (margin.top + 0) + ")")
        .attr("cx", function(d) { return xScale(d.ts); })
        .attr("cy", function(d) { return yScale(d.y); })
        .attr("r", 1.5)
        .attr("class", "circle circle1");

      // z-graph
      chart.append("path")
        .attr("class", "line line2")
        .attr("clip-path", "url(#clip)")
        .attr("d", line(data.map(function(d) { return [d.ts, d.z]; })));

      svg.selectAll("line2")
        .data(data)
        .enter().append("svg:circle")
        .attr("transform", "translate(" + (margin.left + 0) + "," + (margin.top + 0) + ")")
        .attr("cx", function(d) { return xScale(d.ts); })
        .attr("cy", function(d) { return yScale(d.z); })
        .attr("r", 1.5)
        .attr("class", "circle circle2");

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

      // create brush
      brush.x(xScale)
        .on("brushend", brushended);

      var gBrush = chart.append("g")
        .attr("class", "brush")
        .call(brush)
        .selectAll("rect")
        .attr("height", height);

      function brushended() {
        console.log('brushended!', brush.extent());
        dispatch.brushended(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
        d3.selectAll('chart').select('.brush').call(brush.clear());
      }
    },

    render: function() {
      console.log('chart component: render', this.props);
      return (React.DOM.div({id:this.props.id}));
    }
  })