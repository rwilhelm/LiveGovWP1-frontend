/*** @jsx React.DOM */

var Charts = React.createClass({
  // calculates domain with given values
  calculateDomain: function(data, props) {
    return d3.extent(_(data).select('data').map('data').flatten().map(function(d) {
      return props.map(function(e) {
        return d[e];
      });
    }).flatten().value());
  },

  onBrush: function(extent) {
    this.setState({extent: extent}); // propagate extent to child components
    this.props.loadMoreData({extent: extent}); // tell angular to load more data
  },

  getInitialState: function() {
    return {
      xDomain: this.calculateDomain(this.props.data, ['ts']),
      yDomain: this.calculateDomain(this.props.data, ['x', 'y', 'z']),
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      xDomain: this.calculateDomain(nextProps.data, ['ts']),
      yDomain: this.calculateDomain(nextProps.data, ['x', 'y', 'z']),
    });
  },

  render: function() {
    var data = this.props.data;
    var charts =
      data.map(function(sensor) {
        return (
          <div key={sensor.name} className='pure-g'>
            <div className='pure-u-24-24'>
              <ChartHeader
                sensorName={sensor.name.replace(/sensor/, '').replace(/_/g, ' ')}
                loadedData={sensor.data.length}
              />
              <ChartInfo
                sensorName={sensor.name}
                loadedData={sensor.data.length}
              />
              <Chart
                data={sensor.data}
                extent={this.props.extent}
                xDomain={this.state.xDomain}
                yDomain={this.state.yDomain}
                onBrush={this.onBrush}
              />
            </div>
          </div>
        );
      }.bind(this))

    return (
      <div>{charts}</div>
    );
  }

});

