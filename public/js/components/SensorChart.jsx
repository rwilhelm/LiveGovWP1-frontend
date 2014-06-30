/*** @jsx React.DOM */

var SensorChart = React.createClass({

  /* Component Specifications */

  render: function() {
    console.log('SensorChart.jsx:render');

    var data = this.props.data;

    var dimensions = this.calculateDimensions();

    // var dimensions = this.props.dimensions;
    var size   = this.props.dimensions.size;
    var offset = this.props.dimensions.offset; // g element
    var label  = this.props.dimensions.label;

    var sensor  = this.props.sensor;
    var domain = this.props.domain;
    var onBrush = this.props.onBrush;

    var extent = this.props.extent;
    var xScale = d3.time.scale().range([0, size.width]);
    var yScale = d3.scale.linear().range([size.height, 0]);

    xScale.domain(extent.length ? extent : domain.x);
    yScale.domain(domain.y);

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
      <div className="sensorChart pure-g">
        <Chart className="pure-u-24-24" dimensions={dimensions} extent={extent} xDomain={domain.x} yDomain={domain.y} label={label} sensor={sensor}>
          <Brush ref="brush" dimensions={dimensions} extent={extent} domain={domain} onBrush={onBrush} sensor={sensor} className="brush" />
          <Path ref="circleX" data={pathData('x')} className="path pathx" />
          <Path ref="circleY" data={pathData('y')} className="path pathy" />
          <Path ref="circleZ" data={pathData('z')} className="path pathz" />
          <Circles ref="circleX" data={circlesData('x')} className="circle circlex" />
          <Circles ref="circleY" data={circlesData('y')} className="circle circley" />
          <Circles ref="circleZ" data={circlesData('z')} className="circle circlez" />
        </Chart>
      </div>
      );
  },



  getInitialState: function() {
    console.log('SensorChart.jsx:getInitialState');
    return {};
  },

  getDefaultProps: function() {
    console.log('SensorChart.jsx:getDefaultProps');
    return {
      dimensions: {
        size: {
          width: 100,
          height: 100,
        },
        offset: {
          chart: 'translate(0,0)',
          xAxis: 'translate(0,0)',
          yAxis: 'translate(0,0)'
        },
        label: {
          xAxis: {
            x: 0,
            y: 0,
            text: ''
          },
          yAxis: {
            x: 0,
            y: 0,
            text: ''
          },
        }
      }
    };
  },

  propTypes: {
    data       : React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    extent     : React.PropTypes.arrayOf(React.PropTypes.number),
    onBrush    : React.PropTypes.func.isRequired,
    domain     : React.PropTypes.object.isRequired,
    // dimensions : React.PropTypes.object.isRequired,
    // height  : React.PropTypes.number.isRequired,
    // width   : React.PropTypes.number.isRequired,
    // xDomain : React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    // yDomain : React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  },

  mixins: [],
  statics: {},

  displayName: 'SensorChart',

  /* Lifecycle Methods: Mounting */

  componentWillMount: function() {
    console.log('SensorChart.jsx:componentWillMount');
  },

  componentDidMount: function() {
    console.log('SensorChart.jsx:componentDidMount');
    // window.addEventListener("resize", this.updateDimensions);
    this.setState(this.calculateDimensions());
  },

  /* Lifecycle Methods: Updating */

  componentWillReceiveProps: function(nextProps) {
    console.log('SensorChart.jsx:componentWillReceiveProps');
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    console.log('SensorChart.jsx:shouldComponentUpdate');
    return true
  },

  componentWillUpdate: function(nextProps, nextState) {
    console.log('SensorChart.jsx:componentWillUpdate');
    // this.setProps(this.calculateDimensions()); // not possible!
  },

  componentDidUpdate: function(prevProps, prevState) {
    console.log('SensorChart.jsx:componentDidUpdate');
  },

  /* Lifecycle Methods: Unmounting */

  componentWillUnmount: function() {
    console.log('SensorChart.jsx:componentWillUnmount');
  },

  /* Custom Methods */

  calculateDimensions: function() {
    // get the object containing our dimensions
    var dimensions = this.props.dimensions;

    // if the component is mounted, get the dom elements actual size, else
    // keep using the known values or prop defaults
    if (this.isMounted()) {
      dimensions.size = {
        height: this.getDOMNode().offsetHeight,
        width: this.getDOMNode().offsetWidth
      }
    }

    // convinience
    var width = dimensions.size.width;
    var height = dimensions.size.height;

    var margin = {top: 4, right: 19, bottom: 54, left: 18 };

    dimensions.size = {
      width: width - margin.left - margin.right - 10,
      height: height - margin.top - margin.bottom
    };

    function translate(x, y) { return "translate(" + x + "," + y + ")" }
    var axisSpread = function(x) { return { x:x, y:-x }; }(2)

    dimensions.offset = {
      brush    : translate(margin.left, margin.top+11),
      axis     : translate(margin.left+10, margin.top),
      chart    : translate(margin.left+10, margin.top+11),
      clipPath : translate(margin.left+10, margin.top+11),
      xAxis    : translate(0, axisSpread.x + dimensions.size.height + margin.top+10),
      yAxis    : translate(axisSpread.y, margin.top*3),
    }

    dimensions.label = {
      xAxis: {
        x    : dimensions.size.width - margin.right - (margin.right - margin.left) + 3,
        y    : dimensions.size.height + margin.top*3,
        text : 'time'
      },
      yAxis: {
        x    : margin.left-16,
        y    : margin.top+14,
        text : 'sensor value'
      }
    }

    return dimensions;
  },

  // calculateDimensions: function(dimensions) {

  //   var width = dimensions.width;
  //   var height = dimensions.height;

  //   function translate(x, y) { return "translate(" + x + "," + y + ")" }

  //   var margin = {top: 4, right: 4, bottom: 52 + 4 + 13, left: 26 }; // i will never remember

  //   var dimensions = {}; // will be returned

  //   dimensions.outer = {
  //     width: width - margin.left - margin.right,
  //     height: height - margin.top - margin.bottom
  //   };

  //   dimensions.inner = dimensions.outer;

  //   var axisSpread = function(x) { return { x:x + dimensions.inner.height, y:-x }; }(2)

  //   dimensions.offset = {
  //     chart: translate(margin.left, margin.top),
  //     xAxis: translate(0, axisSpread.x),
  //     yAxis: translate(axisSpread.y, 0),
  //   }

  //   dimensions.label = {
  //     xAxis: {x: dimensions.inner.width, y: dimensions.inner.height, text: 'time'},
  //     yAxis: {x: 1,                      y: margin.top,              text: 'sensor value'}
  //   }

  //   return dimensions;
  // },

  // updateDimensions: function() {
  //   console.log('resize');
  //   this.setState({width: this.getDOMNode().offsetWidth, height: this.getDOMNode().offsetHeight / 4}); // TODO
  // }

});
