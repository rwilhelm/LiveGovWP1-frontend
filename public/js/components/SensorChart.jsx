/*** @jsx React.DOM */

var SensorChart = React.createClass({

  propTypes: {
    // data    : React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    extent  : React.PropTypes.arrayOf(React.PropTypes.number),
    height  : React.PropTypes.number.isRequired,
    onBrush : React.PropTypes.func.isRequired,
    width   : React.PropTypes.number.isRequired,
    xDomain : React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    yDomain : React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  },

  getInitialState: function() {
    console.log('SensorChart:getInitialState' + this.props.sensor);
    return {extent: []};
  },

  componentWillMount: function() {
    console.log('SensorChart:componentWillMount' + this.props.sensor);
    // this.setState({width: 10, height: 10 / 4});
  },

  componentDidMount: function() {
    console.log('SensorChart:componentDidMount' + this.props.sensor);
    window.addEventListener("resize", this.updateDimensions);
    // this.setProps({
    //   width: this.getDOMNode().offsetWidth,
    //   // height: this.getDOMNode().offsetHeight / 4
    // });
  },

  componentWillReceiveProps: function(nextProps) {
    console.warn('SensorChart.jsx:componentWillReceiveProps' + this.props.sensor);
    // disable this and the chart wont zoom anymore
    // if (nextProps.extent !== this.props.extent) this.setState({extent:nextProps.extent});
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    console.log('SensorChart.jsx:shouldComponentUpdate' + this.props.sensor);
    // console.log(this.state.extent, this.props.extent, nextState.extent, nextProps.extent);
    if (this.state.extent == nextState.extent) return false;
    return true;
  },

  componentWillUpdate: function(nextProps, nextState) {
    console.log('SensorChart.jsx:componentWillUpdate' + this.props.sensor);
  },

  componentDidUpdate: function(prevProps, prevState) {
    console.log('SensorChart.jsx:componentDidUpdate' + this.props.sensor);
  },

  componentWillUnmount: function() {
    console.log('SensorChart.jsx:componentWillMount' + this.props.sensor);
    // window.removeEventListener("resize", this.updateDimensions);
  },

  updateDimensions: function() {
    this.setState({width: this.getDOMNode().offsetWidth, height: this.getDOMNode().offsetHeight / 4}); // TODO
  },

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

  onBrush: function (extent) {
    console.log('SensorChart.jsx:onBrush');
    // this.setState({extent:extent});
    this.setState({extent:extent});
    // this.props.loadMoreData(extent, extent); // communication with the outside world (angular)
  },

  render: function() {
    console.log('SensorChart.jsx:render' + this.props.sensor);
    var data = this.props.data;
    var width = this.props.width;
    var height = this.props.height;
    var offset = this.props.offset; // g element
    var xDomain = this.props.xDomain;
    var yDomain = this.props.yDomain;
    var innerWidth = this.props.innerWidth;
    var innerHeight = this.props.innerHeight;
    var axisLabel = this.props.axisLabel;
    var onBrush = this.onBrush;

    var extent = this.state.extent;

    var size = {width: width, height: height}; // all children of g
    var innerSize = {width: innerWidth, height: innerHeight};
    var xScale = d3.time.scale().range([0, innerWidth]);
    var yScale = d3.scale.linear().range([innerHeight, 0]);

    xScale.domain(extent.length ? extent : xDomain);
    yScale.domain(yDomain);

    var line = d3.svg.line().interpolate("linear")
      .x(function(d) { return xScale(d[0]); })  // d[0]: Number timestamp
      .y(function(d) { return yScale(d[1]); }); // d[1]: Number sensor value

    function pathData(val) { // String sensor key
      return line(data.dataSeries(['ts', val])); // -> helper
    }

    function circlesData(val) { // val: String sensorKey
      return data.dataSeries(['ts', val]).map(function(d) { // -> helper
        return [xScale(d[0]), yScale(d[1])];
      });
    }

    return (
      <div ref={this.props.sensor + "SensorChart"}>
        <ChartInfo ref="chartInfo" extent={extent} sensor={this.props.sensor}/>
        <Chart ref={this.props.sensor + "Chart"} size={innerSize} offset={offset} extent={extent} xDomain={xDomain} yDomain={yDomain} axisLabel={axisLabel} sensor={this.props.sensor}>
          <Path ref="circleX" data={pathData('x')} size={size} offset={offset} className="path pathx"/>
          <Path ref="circleY" data={pathData('y')} size={size} offset={offset} className="path pathy"/>
          <Path ref="circleZ" data={pathData('z')} size={size} offset={offset} className="path pathz"/>
          <Circles ref="circleX" data={circlesData('x')} className="circle circlex"/>
          <Circles ref="circleY" data={circlesData('y')} className="circle circley"/>
          <Circles ref="circleZ" data={circlesData('z')} className="circle circlez"/>
          <Brush ref="brush" size={size} extent={extent} xDomain={xDomain} yDomain={yDomain} onBrush={this.onBrush} className="brush" sensor={this.props.sensor}/>
        </Chart>
      </div>
    );
  }
});
