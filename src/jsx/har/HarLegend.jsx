/*** @jsx React.DOM */

var HarLegend = React.createClass({
  render: function() {

    return (
      <ul className='legend'>
        <li className='walking'>walking</li>
        <li className='running'>running</li>
        <li className='sitting'>sitting</li>
        <li className='standing'>standing</li>
        <li className='driving'>driving</li>
        <li className='on_table'>on table</li>
        <li className='unknown'>unknown</li>
      </ul>
    );
  }
});
