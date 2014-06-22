/*** @jsx React.DOM */

var ClipPath = React.createClass({
  getDefaultProps: function() {
    return {
      height: 20,
    };
  },
  componentDidMount: function() {
    return {
      width: this.getDOMNode().offsetWidth,
    };
  },
  render: function() {
    return (
      <defs>
        <clippath id="clip">
          <rect width={this.props.width} height={this.props.height}/>
        </clippath>
      </defs>
    );
  }
});
