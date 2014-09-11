/*** @jsx React.DOM */

var ChartInfo = React.createClass({
  render: function() {
    return (
      <div>
        <ChartLegend />
        <ChartDataCount loadedData={this.props.loadedData} availableData={this.props.availableData} />
        <ChartExport tripId={this.props.tripId} sensor={this.props.sensorName} availableData={this.props.availableData} />
      </div>
    );
  }
})
