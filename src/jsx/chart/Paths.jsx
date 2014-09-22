/*** @jsx React.DOM */

var Paths = React.createClass({
  getDefaultProps: function() {
    return {width: 2};
  },
  render: function() {
    var paths = Object.keys(this.props.data).map(function(key) {
      return <path key={key} width={this.props.width} d={this.props.data[key]} className={'path path' + key} />;
    }.bind(this))
    return <g>{paths}</g>;
  }
});
