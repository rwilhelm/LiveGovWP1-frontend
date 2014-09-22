/*** @jsx React.DOM */

var ChartExport = React.createClass({
  render: function() {
    return (
      <div>
        <ul className='export'>
          <li><a className='pure-button' href={'/trips/' + this.props.tripId + '/' + this.props.sensor} download={'livegov-' + this.props.tripId + '-' + this.props.sensor + '.json'} title={'approx. ' + (Math.round(this.props.availableData / 10.25 / 1024)) + ' MB'}>Export</a></li>
        </ul>
      </div>
    );
  }
});