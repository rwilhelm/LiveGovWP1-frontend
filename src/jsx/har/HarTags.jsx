/*** @jsx React.DOM */

var HarTags = React.createClass({
  render: function() {
    var tags = this.props.tags.map(function(tag, i) {
      return(
        <li key={i} className={'harTag ' + tag}>
          {tag}
        </li>
      );
    });

    return (
      <ul className='harTags'>{tags}</ul>
    );
  }
});
