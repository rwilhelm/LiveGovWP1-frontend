/*** @jsx React.DOM */

var TripsFilter = React.createClass({
  render: function() {
    return (
      <span>
        <input type='slider' min='0' max='100' />
      </span>
    );
  }
});
