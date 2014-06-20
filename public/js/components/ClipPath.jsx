/*** @jsx React.DOM */

var ClipPath = React.createClass({
  getDefaultProps: function() {
    return {
      width: this.getDOMNode().offsetWidth,
      height: 20,
    };
  },
  render: function() {
    console.log('me too');
    return (
      <defs>
        <clipPath id='clip'>
          <rect width={this.prop.width} height={this.prop.height}/>
        </clipPath>
      </defs>
    );
  }
});
