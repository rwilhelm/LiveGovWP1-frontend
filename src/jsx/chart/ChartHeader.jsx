/*** @jsx React.DOM */

var ChartHeader = React.createClass({
  showHideSensorChart: function(e) {
    var nodes = e.currentTarget.parentNode.getElementsByTagName('div');
    _.each(nodes, function(node) {
      node.classList.contains('hidden') ? node.classList.remove('hidden') : node.classList.add('hidden');
    })
    var dots = e.currentTarget.lastChild;
    dots.classList.contains('hidden') ? dots.classList.remove('hidden') : dots.classList.add('hidden');
  },

  render: function() {
    return (
      <h1 className='chartHeader' onClick={this.showHideSensorChart}>
        {this.props.sensorName}
        <small className='hidden'> {this.props.loadedData}/{this.props.availableData} ...</small>
      </h1>
    );
  }
});
