/*** @jsx React.DOM */

var Label = React.createClass({
  getDefaultProps: function() {
    return {
      // x: 1209,
      // y: 120,
      // anchor: 'end',
      // axis: 'x',
      // class: 'x label',
      // text: 'time'
    };
  },
  componentDidMount: function() {
    debugger
    // return {
    //   x: this.getDOMNode().offsetWidth,
    //   y: this.getDOMNode().offsetHeight
    // };
  },
  render: function() {
    return (
      <text class={this.props.class} text-anchor={this.props.anchor} x={this.props.x} y={this.props.y}>
        {this.props.children}
      </text>
    );
  }
})
