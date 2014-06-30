/*** @jsx React.DOM */

var MiniMap = React.createClass({

	/* Component Specifications */

	render: function() {
		var extent = this.props.extent;
		var xDomain = this.props.domain.x;
		var yDomain = this.props.domain.y;
		var onBrush = this.props.onBrush;

		console.log('MiniMap.jsx:render');
		return (
			<div id="minimap">
	      <MiniMapBrush ref="brush" extent={extent} xDomain={xDomain} onBrush={onBrush} />
			</div>
		);
	},

	getInitialState: function() {
		console.log('MiniMap.jsx:getInitialState');
		return {}
	},

	getDefaultProps: function() {
		console.log('MiniMap.jsx:getDefaultProps');
		return {}
	},

	propTypes: {},
	mixins: [],
	statics: {},
	displayName: 'MiniMap',

	/* Lifecycle Methods: Mounting */

	componentWillMount: function() {
		console.log('MiniMap.jsx:componentWillMount');
	},

	componentDidMount: function() {
		console.log('MiniMap.jsx:componentDidMount');
	},

	/* Lifecycle Methods: Updating */

	componentWillReceiveProps: function(nextProps) {
		console.log('MiniMap.jsx:componentWillReceiveProps');
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		console.log('MiniMap.jsx:shouldComponentUpdate');
		return true
	},

	componentWillUpdate: function(nextProps, nextState) {
		console.log('MiniMap.jsx:componentWillUpdate');
	},

	componentDidUpdate: function(prevProps, prevState) {
		console.log('MiniMap.jsx:componentDidUpdate');
	},

	/* Lifecycle Methods: Unmounting */

	componentWillUnmount: function() {
		console.log('MiniMap.jsx:componentWillUnmount');
	},

});
