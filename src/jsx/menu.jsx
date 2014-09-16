/*** @jsx React.DOM */

var Menu = React.createClass({
  getInitialState: function() {
    return {
      activity: false
    };
  },

  render: function() {
    // console.log('REACT ENV: ', this.props.env);

    var href = function(loc) {
      // return this.props.tripId ? '/#/' + loc + '/' + this.props.tripId : '';
      return this.props.tripId ? '#/' + loc + '/' + this.props.tripId : '';
    }.bind(this);

    var className = function(loc) {
      var classes = '';
      classes += !this.props.tripId ? ' pure-menu-disabled' : '';
      classes += this.props.loc === loc ? ' pure-menu-selected' : '';
      return classes;
    }.bind(this);

    // FIX BASE URL LINK ON "RECORDS" LINK FIXME

    return (
      <ul className='pure-menu pure-menu-open pure-menu-horizontal'>
        <li>
          <a ui-sref='trips'>Records</a>
        </li>
        <li>
          <a ui-sref='raw'>Raw Data</a>
        </li>
        <li>
          <a ui-sref='har'>Activity Recognition</a>
        </li>
        <li>
          <a ui-sref='sld'>Service Line Detection</a>
        </li>
      </ul>
    );
  }
});
