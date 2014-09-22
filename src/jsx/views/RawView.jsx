/*** @jsx React.DOM */

var Raw = React.createClass({
  onBrush: function(extent) {
    this.setState({extent: extent}); // propagate extent to child components
    this.props.loadMoreData({extent: extent}); // tell angular to load more data
  },

  getInitialState: function() {
    return {
      extent: [],
    };
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('componentWillReceiveProps: nextprops: ', nextProps)
  },

  render: function() {
		return (
      <div id='raw'>
        <div id='main'>
          <Map data={this.props.trip.data} extent={this.state.extent} />
          <Charts
            trip={this.props.trip}
            extent={this.state.extent}
            onBrush={this.onBrush}
            />
        </div>
      </div>
		);
	}
});
