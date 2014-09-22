/*** @jsx React.DOM */

var Circles = React.createClass({
  getDefaultProps: function() {
    return {radius: 1.5};
  },

  render: function() {
    var circles = Object.keys(this.props.data).map(function(key) {
      return <g key={key} className={key}>{
        this.props.data[key].map(function(d,i) {
          return <circle key={i} cx={d[0]} cy={d[1]} r={this.props.radius} className={'circle circle' + key} />;
        }.bind(this))
      }</g>
    }.bind(this));
    return <g>{circles}</g>;
  },
});
