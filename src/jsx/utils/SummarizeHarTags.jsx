/** @jsx React.DOM */

var SummarizeHarTags = {
  sum: function(har) {
    return har.slice().filter(function(c, i, a) {
      return a[i - 1] ? a[i].tag !== a[i - 1].tag : true;
    }).map(function(c, i, a) {
      return a[i + 1] ? {
        start: a[i].ts,
        stop: a[i + 1].ts,
        tag: a[i].tag
      } : {
        start: a[i].ts,
        stop: har[har.length - 1].ts,
        tag: a[i].tag
      };
    }).filter(function(d) {
      return d.start !== d.stop;
    });
  }
}
