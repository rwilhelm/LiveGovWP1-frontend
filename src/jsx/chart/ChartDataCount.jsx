/*** @jsx React.DOM */

var ChartDataCount = React.createClass({
  render: function() {
    return (
      <div>
        <ul className='count'>
          <li><a className='pure-button'>Data Count:</a></li>
          <li><a className='pure-button'>{this.props.loadedData}/{this.props.availableData}</a></li>
        </ul>
      </div>
    );
  }
});
