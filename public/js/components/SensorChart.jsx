/*** @jsx React.DOM */

var SensorChart = React.createClass({

  propTypes: {
    data         : React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    extent       : React.PropTypes.arrayOf(React.PropTypes.number),
    height       : React.PropTypes.number.isRequired,
    loadMoreData : React.PropTypes.func.isRequired,
    width        : React.PropTypes.number.isRequired,
    xDomain      : React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    yDomain      : React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  },

  // Mounting [1] getInitialState(): object is invoked before a component is
  // mounted. Stateful components should implement this and return the initial
  // state data. [2] componentWillMount() is invoked immediately before
  // mounting occurs. [3] componentDidMount() is invoked immediately after
  // mounting occurs. Initialization that requires DOM nodes should go here.

  getInitialState: function() {
    console.log('SensorChart:getInitialState', this.props);
    return {extent: []};
  },

  componentWillMount: function() {
    console.log('SensorChart:componentWillMount', this.props);
    // this.setState({width: 10, height: 10 / 4});
  },

  componentDidMount: function() {
    console.log('SensorChart:componentDidMount', this.props);
    window.addEventListener("resize", this.updateDimensions);
    // this.setProps({
    //   width: this.getDOMNode().offsetWidth,
    //   // height: this.getDOMNode().offsetHeight / 4
    // });
  },

  // Updating [4] componentWillReceiveProps(object nextProps) is invoked when
  // a mounted component receives new props. This method should be used to
  // compare this.props and nextProps to perform state transitions using
  // this.setState(). [5] shouldComponentUpdate(object nextProps, object
  // nextState): boolean is invoked when a component decides whether any
  // changes warrant an update to the DOM. Implement this as an optimization
  // to compare this.props with nextProps and this.state with nextState and
  // return false if React should skip updating. [6]
  // componentWillUpdate(object nextProps, object nextState) is invoked
  // immediately before updating occurs. You cannot call this.setState() here.
  // [7] componentDidUpdate(object prevProps, object prevState) is invoked
  // immediately after updating occurs.

  componentWillReceiveProps: function(nextProps) {
    console.warn('SensorChart.jsx:componentWillReceiveProps', this.props.extent, nextProps.extent);
    this.props.extent = nextProps.extent;
    this.setState({
      extent: nextProps.extent != this.props.extent ? nextProps.extent : []
    })
  },

  shouldComponentUpdate: function(nextProps, nextState) {
  },

  componentWillUpdate: function(nextProps, nextState) {
    console.log('SensorChart.jsx:componentWillUpdate', nextProps, nextState);
  },

  componentDidUpdate: function(prevProps, prevState) {
    console.log('SensorChart.jsx:componentDidUpdate', prevProps, prevState);
  },

  // Unmounting [8] componentWillUnmount() is invoked immediately before a
  // component is unmounted and destroyed. Cleanup should go here.

  componentWillUnmount: function() {
    console.log('SensorChart.jsx:componentWillMount', this.props);
    // window.removeEventListener("resize", this.updateDimensions);
  },

  // updateDimensions: function() {
  //   // this.setState({width: this.getDOMNode().offsetWidth, height: this.getDOMNode().offsetHeight / 4});
  // },

  getDefaultProps: function() {
    var margin = {top: 4, right: 4, bottom: 52 + 4 + 13, left: 26 }; // i will never remember
    var padding = {top: 0, right: 0, bottom: 16, left: 16 };

    // vanilla this.props.width/height: svg element
    var innerWidth = this.props.width - margin.left - margin.right;
    var innerHeight = this.props.height - margin.top - margin.bottom;
    var width = innerWidth - padding.left - padding.right;
    var height = innerHeight - padding.top - padding.bottom;

    function translate(x, y) { return "translate(" + x + "," + y + ")" }

    var axisSpread = function(x) { return { x:x, y:-x }; }(2)

    var axisLabel = {
      xAxis: {x: innerWidth, y: innerHeight, text: 'time'}, // font size - axis shift
      yAxis: {x: 1,          y: margin.top,  text: 'sensor value'}
    }

    return {
      axisLabel: axisLabel,
      innerWidth: innerWidth,
      innerHeight: innerHeight,
      width: width,
      height: height,
      offset: {
        g: translate(margin.left, margin.top),
        x: translate(0, innerHeight + axisSpread.x), // x-axis
        y: translate(axisSpread.y, 0), // y-axis
      }
    };
  },

  render: function() {
    var data = this.props.data;
    var width = this.props.width;
    var height = this.props.height;
    var extent = this.props.extent;
    var offset = this.props.offset; // g element
    var xDomain = this.props.xDomain;
    var yDomain = this.props.yDomain;
    var innerWidth = this.props.innerWidth;
    var innerHeight = this.props.innerHeight;
    var axisLabel = this.props.axisLabel;
    var loadMoreData = this.loadMoreData;

    var size = {width: width, height: height} // all children of g
    var innerSize = {width: innerWidth, height: innerHeight}

    var xScale = d3.time.scale().range([0, innerWidth]);
    var yScale = d3.scale.linear().range([innerHeight, 0]);

    xScale.domain(extent.length ? extent : xDomain);
    yScale.domain(yDomain);

    var line = d3.svg.line().interpolate("linear")
      .x(function(d) { return xScale(d[0]) })  // d[0]: Number timestamp
      .y(function(d) { return yScale(d[1]) }); // d[1]: Number sensor value

    function pathData(val) { // String sensor key
      return line(data.dataSeries(['ts', val])); // -> helper
    }

    function circlesData(val) { // val: String sensorKey
      return data.dataSeries(['ts', val]).map(function(d) { // -> helper
        return [xScale(d[0]), yScale(d[1])];
      });
    }

    // var loadMoreData = {
    //   extent: this.state.extent,
    //   requestChange: this.update
    // }

    return (
      <Chart size={innerSize} offset={offset} extent={extent} xDomain={xDomain} yDomain={yDomain} axisLabel={axisLabel}>
        <Path data={pathData('x')} size={size} offset={offset} className="path pathx"/>
        <Path data={pathData('y')} size={size} offset={offset} className="path pathy"/>
        <Path data={pathData('z')} size={size} offset={offset} className="path pathz"/>
        <Circles data={circlesData('x')} className="circle circlex"/>
        <Circles data={circlesData('y')} className="circle circley"/>
        <Circles data={circlesData('z')} className="circle circlez"/>
        <Brush size={size} extent={extent} xDomain={xDomain} yDomain={yDomain} loadMoreData={loadMoreData} className="brush"/>
      </Chart>
    );
  },

  loadMoreData: function (extent) {
    console.log('SensorChart.jsx:loadMoreData', extent);
    this.setState({extent: extent});
    // FIXME only communicate with directive if neccesary
    // this.props.loadMoreData(extent, extent);
  }
});
