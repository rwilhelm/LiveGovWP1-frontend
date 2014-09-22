/*** @jsx React.DOM */

var HarTable = React.createClass({
  render: function() {
    var rows = this.props.data.map(function(d, i) {
      return(
        <tr key={i} className={d.tag}>
          <td>{moment(d.start).format('HH:mm:ss')}</td>
          <td>{moment(d.stop).format('HH:mm:ss')}</td>
          <td>{d.tag}</td>
        </tr>
      );
    });

    return (
      <table>
        <thead><th>start</th><th>stop</th><th>tag</th></thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});
