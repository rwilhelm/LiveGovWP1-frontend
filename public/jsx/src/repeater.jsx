/** @jsx React.DOM */
window.Repeater = React.createClass({
  render: function() {

    var scope = this.props.scope;

    var rows = _.map(scope.data, function(datum) {
      var clickHandler = scope.$apply.bind(
        scope,
        scope.clickHandler.bind(null, datum)
      );

      return (
        <tr onClick={clickHandler}>
          <td>{datum['0']}</td>
          <td>{datum['1']}</td>
          <td>{datum['2']}</td>
          <td>{datum['3']}</td>
          <td>{datum['4']}</td>
        </tr>
      );
    });

    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
});
