/*** @jsx React.DOM */

/*

	http://facebook.github.io/react/docs/component-api.html
	http://facebook.github.io/react/docs/component-specs.html

 */

var RawView = React.createClass({

	//////////////////////////////
	/* Component Specifications */
	//////////////////////////////

	render: function() {
		console.log('RawView.jsx:render');

		var domain = this.state.domain;
		var extent = this.state.extent;

		var data = this.props.data;
		var trip = this.props.trip;
		var scope = this.props.scope;
		var onBrush = this.onBrush;

		return (
			<div>
				<TripInfo trip={trip}/>
				<SensorChart ref="graChart" data={data.gra} extent={extent} domain={domain} onBrush={onBrush} sensor='gra'/>
				<SensorChart ref="accChart" data={data.acc} extent={extent} domain={domain} onBrush={onBrush} sensor='acc'/>
				<SensorChart ref="lacChart" data={data.lac} extent={extent} domain={domain} onBrush={onBrush} sensor='lac'/>
				<MiniMap id="miniMap" ref="miniMap" data={data} extent={extent} domain={domain} onBrush={onBrush} />
			</div>
		);
	},

/*

				<div className='pure-g'>
					<SensorTable className='pure-u-1-3 sensorTable pure-table' ref="graTable" data={data.gra} extent={extent}/>
					<SensorTable className='pure-u-1-3 sensorTable pure-table' ref="accTable" data={data.acc} extent={extent}/>
					<SensorTable className='pure-u-1-3 sensorTable pure-table' ref="lacTable" data={data.lac} extent={extent}/>
				</div>

 */

	getInitialState: function() {
		console.log('RawView.jsx:getInitialState');

		var sensors = ['acc', 'gra', 'lac'];
		var xDomainSpecs = ['starttime', 'endtime'];
		var yDomainSpecs = ['x', 'y', 'z'];

		return {
			extent: [],
			domain: {
				x: this.props.data.select(sensors).flatten().calculateDomain(xDomainSpecs),
				y: this.props.data.select(sensors).flatten().calculateDomain(yDomainSpecs),
			}
		};
	},

	getDefaultProps: function() {
		console.log('RawView.jsx:getDefaultProps');
		return {};
	},

	propTypes: {
	},

	mixins: [],

	statics: {},

	displayName: 'RawView',



	/////////////////////////////////
	/* Lifecycle Methods: Mounting */
	/////////////////////////////////

	componentWillMount: function() {
		console.log('RawView.jsx:componentWillMount');
	},

	componentDidMount: function() {
		console.log('RawView.jsx:componentDidMount');
	},



	/////////////////////////////////
	/* Lifecycle Methods: Updating */
	/////////////////////////////////

	componentWillReceiveProps: function(nextProps) {
		console.log('RawView.jsx:componentWillReceiveProps');
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		console.log('RawView.jsx:shouldComponentUpdate');
		return true;
	},

	componentWillUpdate: function(nextProps, nextState) {
		console.log('RawView.jsx:componentWillUpdate');
	},

	componentDidUpdate: function(prevProps, prevState) {
		console.log('RawView.jsx:componentDidUpdate');
	},



	///////////////////////////////////
	/* Lifecycle Methods: Unmounting */
	///////////////////////////////////

	componentWillUnmount: function() {
		console.log('RawView.jsx:componentWillUnmount');
	},



	////////////////////
	/* Custom Methods */
	////////////////////

	onBrush: function(extent) {
		console.log('RawView.jsx:onBrush');
		this.setState({extent: extent});
	}

});
