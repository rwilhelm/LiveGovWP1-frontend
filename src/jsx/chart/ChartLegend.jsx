/*** @jsx React.DOM */

var ChartLegend = React.createClass({
  render: function() {
    return (
      <div>
        <ul className='legend'>
          <li><a className='pure-button'>Legend:</a></li>
          <li><a className='pure-button x'>x</a></li>
          <li><a className='pure-button y'>y</a></li>
          <li><a className='pure-button z'>z</a></li>
        </ul>
      </div>
    );
  }
});
