/*** @jsx React.DOM */

var Chart = React.createClass({
  getDefaultProps: function() {
    return {
      margin: {top: 20, right: 10, bottom: 30, left: 30}
    }
  },

  getInitialState: function() {
    return {
      width: window.innerWidth - this.props.margin.left - this.props.margin.right,
      height: window.innerHeight - this.props.margin.top - this.props.margin.bottom,
    };
  },

  componentDidMount: function() {
    var resizeChart = function() {
      this.setState({
        width: this.getDOMNode().offsetWidth - this.props.margin.left - this.props.margin.right,
        height: this.getDOMNode().offsetHeight - this.props.margin.top - this.props.margin.bottom
      });
      this.clipPath();
      this.axis();
    }.bind(this);

    window.addEventListener('resize', function() { resizeChart(); }.bind(this));
    resizeChart();
  },

  componentDidUpdate: function(prevProps, prevState) {
    this.axis();
  },

  // append clip path to svg > devs or update it
  clipPath: function() {
    var e = d3.select(this.getDOMNode()).select('defs');

    if (e.select('#clip').empty()) {
      e.append('svg:clipPath').attr('id', 'clip');
    }

    if (e.select('#clip').select('rect').empty()) {
      e.select('#clip').append('rect');
    }

    e.select('#clip').select('rect')
      .attr('width', this.state.width)
      .attr('height', this.state.height);

    d3.select(this.getDOMNode()).select('g.chart')
      .attr('clip-path', 'url(#clip)');
  },

  // create x/y-axis on the appropiate dom node
  axis: function() {
    var xScale = d3.time.scale().range([0, this.state.width]);
    xScale.domain(this.props.extent.length ? this.props.extent : this.props.xDomain);
    var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(Math.max(this.state.height / 20, 2));

    var yScale = d3.scale.linear().range([this.state.height, 0]);
    yScale.domain(this.props.yDomain);
    var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(Math.max(this.state.height / 20, 2));

    d3.select(this.getDOMNode()).select('.x.axis').call(xAxis);
    d3.select(this.getDOMNode()).select('.y.axis').call(yAxis);
  },

  render: function() {
    var xScale = d3.time.scale().range([0, this.state.width]);
    var yScale = d3.scale.linear().range([this.state.height, 0]);

    xScale.domain(this.props.extent.length ? this.props.extent : this.props.xDomain);
    yScale.domain(this.props.yDomain);

    var line = d3.svg.line().interpolate('linear')
      .x(function(d) { return xScale(d[0]); })  // d[0]: Number timestamp
      .y(function(d) { return yScale(d[1]); }); // d[1]: Number sensor value

    var axisSpread = function(x) { return { x:x, y:-x }; }(0)
    var translate = function(x, y) { return 'translate(' + x + ',' + y + ')' }

    function dataSeries(data, props) {
      return data.map(function(d) {
        return props.map(function(p) {
          return d[p];
        });
      });
    };

    var circleData = function(values) {
      var r = {};
      values.forEach(function(val) {
        r[val] = dataSeries(this.props.data, ['ts', val]).map(function(d) {
          return [xScale(d[0]), yScale(d[1])];
        }.bind(this));
      }.bind(this));
      return r;
    }.bind(this);

    var pathData = function(values) {
      var r = {};
      values.forEach(function(val) {
        r[val] = line(dataSeries(this.props.data, ['ts', val]))
      }.bind(this));
      return r;
    }.bind(this);

    return (
      <div className='chart'>
        <svg>
          <defs />
          <g transform={translate(this.props.margin.left, this.props.margin.top)}>
            <text className='x label' textAnchor='end' x={this.state.width} y={this.state.height - 2}>time</text>
            <text className='y label' textAnchor='end' y='2' transform='rotate(-90)' >value</text>
            <g className='x axis' transform={translate(0, this.state.height)} />
            <g className='y axis' />
          </g>
          <g className='chart' width={this.state.width} height={this.state.height} transform={translate(this.props.margin.left, this.props.margin.top)}>
            <Paths data={pathData(['x', 'y', 'z'])} />
            <Circles data={circleData(['x', 'y', 'z'])} />
            <Brush width={this.state.width} height={this.state.height} extent={this.props.extent} xDomain={this.props.xDomain} yDomain={this.props.yDomain} onBrush={this.props.onBrush} />
          </g>
        </svg>
      </div>
    )
  },
});
