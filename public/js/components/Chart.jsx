/*** @jsx React.DOM */

var Chart = React.createClass({
  getDefaultProps: function() {
    var margin = {top: 2, right: 1, bottom: 21, left: 24 };
    var translate = function(x, y) {
      return (margin.left + x) + "," + (margin.top + y);
    };

    return {
      translate: translate,
      margin: margin,
    };
  },

  componentDidMount: function() {
    return {
      width: this.getDOMNode().offsetWidth - this.props.margin.left - this.props.margin.right,
      height: 192,
    };
  },

  // <Chart ref="acc" class="chart acc" data="data.acc"/>
  render: function() {
    return (
      <svg class="chart" width={this.props.width} height={this.props.height}>
        <ClipPath/>
        <g transform={this.prop.translate(0, 0)}>
          <Label class="label labelx" text-anchor="end" x={this.props.width} y={this.props.heigth}> time </Label>
          <Label class="label labely" text-anchor="start" x="0" y={10-3}> sensor value </Label>
          <Axis class="axis axisx" transform={this.prop.translate(0, this.prop.height + 3)}/>
          <Axis class="axis axisy" transform={this.prop.translate(-3, this.prop.margin.top)}/>
          <Path ref="path1" class="path path1" d={this.data('y')} transform={this.prop.translate(0, this.prop.height + 3)}/>
          <Path ref="path2" class="path path2" d={this.data('x')} transform={this.prop.translate(0, this.prop.height + 3)}/>
          <Path ref="path3" class="path path3" d={this.data('z')} transform={this.prop.translate(0, this.prop.height + 3)}/>
          <Circles ref="circles1" class="circles circles1" d={this.data('x')}/>
          <Circles ref="circles2" class="circles circles2" d={this.data('y')}/>
          <Circles ref="circles3" class="circles circles3" d={this.data('z')}/>
          <Brush />
        </g>
      </svg>
    );
  }
});

React.renderComponent(<Chart data={this.props.data} />, this.getDOMNode());
