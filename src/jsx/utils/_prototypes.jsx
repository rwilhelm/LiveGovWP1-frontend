/** @jsx React.DOM */

/////////////////////////////////////////////////////////////////////////////
// PROTOTYPES                                                              //
/////////////////////////////////////////////////////////////////////////////

// flatten an array
Array.prototype.flatten = function() {
  return [].concat.apply([], this);
};

// return array of property values, e.g. [[objs],...] -> [props]
Array.prototype.select = function(props) {
  return this.flatten().map(function(d) {
    return props.map(function(p) {
      return d[p];
    });
  }).flatten();
};

Array.prototype.dataSeries = function(props) {
  return this.map(function(d) {
    return props.map(function(p) {
      return d[p];
    });
  });
};
