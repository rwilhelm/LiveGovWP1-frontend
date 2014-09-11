/*** @jsx React.DOM */

var Charts = React.createClass({
  // calculates domain with given values
  calculateDomain: function(data, props) {
    return d3.extent(Object.keys(data).filter(function(d) {
      return data[d].length && data[d][0].hasOwnProperty(props[0]); // check all props (TODO)
    }).map(function(sensor) {
      return data[sensor].select(props);
    }).flatten());
  },

  getInitialState: function() {
    return {
      xDomain: this.calculateDomain(this.props.trip.data, ['ts']),
      yDomain: this.calculateDomain(this.props.trip.data, ['x', 'y', 'z']),
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      xDomain: this.calculateDomain(nextProps.trip.data, ['ts']),
      yDomain: this.calculateDomain(nextProps.trip.data, ['x', 'y', 'z']),
    });
  },

  render: function() {
    var count = this.props.trip.count;
    var data = this.props.trip.data;
    var id = this.props.trip.id;

    var charts =
      Object.keys(data)
      .filter(function(sensor) {
        return !sensor.match(/_har|_gps|_tags/); // exclude data w/o x/y/z
      })
      .map(function(sensor) {
        return {
          name: sensor,
          data: data[sensor]
        };
      })
      .map(function(sensor) {
        return (
          <div key={sensor.name} className='pure-g'>
            <div className='pure-u-24-24'>
              <ChartHeader
                sensorName={sensor.name.replace(/sensor/, '').replace(/_/g, ' ')}
                loadedData={sensor.data.length}
                availableData={count[sensor.name]}
              />
              <ChartInfo
                sensorName={sensor.name}
                loadedData={sensor.data.length}
                availableData={count[sensor.name]}
                tripId={id}
              />
              <Chart
                data={sensor.data}
                extent={this.props.extent}
                xDomain={this.state.xDomain}
                yDomain={this.state.yDomain}
                onBrush={this.props.onBrush}
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

