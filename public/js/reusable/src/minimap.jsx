/** @jsx React.DOM */
var minimap = React.createClass({
  // http://facebook.github.io/react/docs/component-specs.html

  // getInitialState: function() {
  //   console.info('chart component: getInitialState', this.props);
  //   return {extent: []};
  // },

  componentDidMount: function() {
    console.info('chart component: componentDidMount', this.props);
    if (this.props.data) {
      this.renderMinimap(this.props.data);
    }
  },

  // first after brushended
  shouldComponentUpdate: function(nextProps, nextState) {
    // console.info('chart component: shouldComponentUpdate', this.props, nextProps, nextState);
    if (nextState) {
      return (this.props.extent !== nextState.extent);
    }
  },

  // third after brushended (triggers renderChart)
  componentDidUpdate: function(prevProps, prevState) {
    console.info('chart component: componentDidUpdate', this.props, prevProps, prevState);
    this.renderMinimap(prevProps.data);
  },

  renderMinimap: function() {
    // var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });

    var margin = {top: 0, right: 0, bottom: 0, left: 0 },
      width = this.getDOMNode().parentNode.offsetWidth - margin.left - margin.right,
      height = 50,
      xScale = d3.time.scale().range([0, width]),
      yScale = d3.scale.linear().range([height, 0]),
      brush = d3.svg.brush();

    var data = this.props.data;
    var extent = this.props.extent;
    var xDomain = this.props.xDomain;
    var yDomain = this.props.yDomain;
    var element = this.getDOMNode();

    xScale.domain(xDomain);
    yScale.domain(yDomain);

    // create svg element if it doesn't exist
    if (d3.select(element).select('svg').empty()) {
      d3.select(element)
        .append('svg')
          .classed('minimap', true)
          .attr("width", width)
          .attr("height", height)
        .append("rect")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);
    }

    // select svg element
    var svg = d3.select(element).select('svg');

    // initialize tooltip
    // svg.call(tip);

    // remove old children of svg element
    svg.selectAll("*").remove();

    // iterate through each har tag and draw colored rectangles into our svg
    // element.
    data.forEach(function(d, i, a) {
      var start = a[i][0];
      var stop = a[i][1];
      var tagName = a[i][2];

      svg.append("rect")
        .attr("width", function(d) {
          // console.log(stop - start, xScale(stop), xScale(stop) - xScale(start));
          return xScale(stop) - xScale(start);
        })
        .attr("height", height)
        .attr("x", function() {
          return xScale(start);
        })
        .attr("y", 0)
        .attr("class", tagName.replace(/ /g, '-')); // har tag -> css
        // .on('mouseover', tip.show)
        // .on('mouseout', tip.hide);
    });

    // create brush
    brush.x(xScale)
      .on("brush", brushed)
      .on("brushend", brushended);

    // programatically set brush extent if it's set
    if (extent) {
      brush.extent(extent);
    } else {
      brush.clear();
    }

    // draw the actually clickable brush rectangle
    var gBrush = svg.append("g")
      .attr("class", "brush")
      .call(brush)
      .selectAll("rect")
      .attr("height", height);

    var that = this;
    function brushed() {
      // that.setState({extent: brush.empty() ? [] : brush.extent().map(function(d) { return +d; })});
      that.updateExtent(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
      // that.changeHandler(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
      // dispatch.brushed(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
    }

    function brushended() {
      // that.setState({extent: brush.empty() ? [] : brush.extent().map(function(d) { return +d; })});
      that.loadMoreData(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
      // if (!d3.event.sourceEvent) return; // only transition after input
      // dispatch.brushended(brush.extent().map(function(d) { return +d; }));
    }
  },

  loadMoreData: function(extent) {
    // this.setState({ extent: extent });
    return this.props.loadMoreData(extent, this.props.extent);
  },

  updateExtent: function(extent) {
    return this.props.updateExtent(extent);
  },

  changeHandler: function(extent) {
    return this.props.onChange(extent, this.props.extent);
  },

  render: function() {
    // console.info('chart component: render', this.props);
    return React.DOM.div();
  }
});
