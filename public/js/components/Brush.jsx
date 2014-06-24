/*** @jsx React.DOM */

var Brush = React.createClass({
	update:function(modifiedValue){
		this.setState({value: modifiedValue});
	},
	// getInitialState: function() {
	// 	return {
	// 		extent: this.props.extent
	// 	};
	// },

  loadMoreData: function(extent) {
    // this.setState({ extent: extent });
    console.log('Brush.jsx:loadMoreData' + this.props.sensor);
    this.props.loadMoreData(extent);
    // return this.props.loadMoreData(extent, this.props.extent);
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('Brush.jsx:componentWillReceiveProps' + this.props.sensor);
  },

  componentWillUpdate: function(nextProps, nextState) {
    console.log('Brush.jsx:componentWillUpdate' + this.props.sensor);
  },

  // brush: function() {
  //   var brush = d3.svg.brush();

  // },
  
	componentDidMount: function() {
    var xScale = d3.time.scale()
      .range([0, this.props.size.width]);

    var yScale = d3.scale.linear()
      .range([this.props.size.height, 0]);

    xScale.domain(this.props.extent.length ? this.props.extent : this.props.xDomain);
    yScale.domain(this.props.yDomain);

		var brush = d3.svg.brush();
    var chart = d3.select(this.getDOMNode());

    brush.x(xScale)
      .on("brushend", this.brushended.bind(this, brush));
      // .on("brushend", this.brushended.bind(this, brush));

    if (this.props.extent.length) {
      brush.extent(this.props.extent);
    } else {
      brush.clear();
    }

    var gBrush = chart.append("g")
      .attr("class", "brush")
      .call(brush)
      .selectAll("rect")
      .attr("height", this.props.size.height - 72); // FIXME

	},


	componentWillReceiveProps: function(nextProps) {
		console.log('Brush.jsx:componentWillReceiveProps:' + this.props.sensor);
		// this.setState({
		// 	extent: nextProps.extent
		// })
	},


	componentWillUpdate: function(nextProps, nextState) {
		console.log('Brush.jsx:componentWillUpdate:' + this.props.sensor);
	},


	componentDidUpdate: function(prevProps, prevState) {
		console.log('Brush.jsx:componentDidUpdate:' + this.props.sensor);
    d3.selectAll('chart').select('.brush').call(brush.clear());
	},


  brushended: function(brush) {
  	// this.props.extent = brush.empty() ? [] : brush.extent().map(function(d) { return +d; });
    // loadMoreData(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
    // this.loadMoreData(brush.extent().map(function(d) { return +d; }));
    this.loadMoreData(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
    // this.props.extent.bind(this) = brush.empty() ? [] : brush.extent().map(function(d) { return +d; });
    // this.props.extent.bind(this) = brush.empty() ? [] : brush.extent().map(function(d) { return +d; });
    // console.log('Brush.jsx:brushended': this.props.extent);
    // this.loadMoreData.bind(this, brush.empty() ? [] : brush.extent().map(function(d) { return +d; }), brush.extent().map(function(d) { return +d; }));
    // that.setState({extent: brush.empty() ? [] : brush.extent().map(function(d) { return +d; })});
    // dispatch.brushended(brush.empty() ? [] : brush.extent().map(function(d) { return +d; }));
  },

	render: function() {
		return (
			<g />
		);
	}

});
