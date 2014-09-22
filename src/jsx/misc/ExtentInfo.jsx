/*** @jsx React.DOM */

var ExtentInfo = React.createClass({
  render: function() {
    var extent = this.props.extent.map(function(d) { return moment(d).format('HH:mm:ss'); }).join(' - ');
    return <ul className='extentInfo'><li>{extent}</li></ul>;
  }
});
