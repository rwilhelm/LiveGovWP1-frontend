(function() {
  'use strict';

  /* GENERAL */

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

  // return the most occurring element of an array
  // NOTE: returns last touched element if there are multiple top counts
  Array.prototype.most = function() {
    var that = this;
    return this.slice().sort(function(a, b) {
        return that.filter(function(v){ return v === a; }).length -
               that.filter(function(v){ return v === b; }).length;
    }).pop();
  };

  Array.prototype.dataSeries = function(props) {
    return this.map(function(d) {
      return props.map(function(p) {
        return d[p];
      });
    });
  };

  // sum object of arrays
  // Object.prototype.length = function() {
  //   var that = this;
  //   return Object.keys(this).map(function(k){
  //     return that[k].length;
  //   }).reduce(function(a,b){
  //     return a+b;
  //   });
  // };

          // function sensorDataCount() {
          //   if (!$scope.trip) return false;
          //   return Object.keys($scope.trip.sensorData.sensors)
          //   .map(function(k){return $scope.trip.sensorData.sensors[k].length;})
          //   .reduce(function(a,b){return a+b;});
          // }

  Array.prototype.summarize = function(val) { // har tags [{ts: string, tag: string}]
    var j=0;
    return this.map(function(c, i, a) {
      if (a[i+1]) {
        if (a[i+1][val] !== a[i][val]) {
          var r = [a[j].ts, a[i].ts, a[i].tag];
          j=i+1;
          return r;
        }
      }
    }).filter(function(d) { return d; });
  };

  Array.prototype.unique = function() {
      var o = {}, i, l = this.length, r = [];
      for(i=0; i<l;i+=1) o[this[i]] = this[i];
      for(i in o) r.push(o[i]);
      return r;
  };

  // Object.prototype.getById = function(id) {
  //   return this.filter()

  //   // var that = this;
  //   // return function(that, id) {
  //   //   var i=0, len=that.length;
  //   //   for (; i<len; i++) {
  //   //     if (+that[i].id == +id) {
  //   //       return that[i];
  //   //     }
  //   //   }
  //   //   return null;
  //   // };
  // };

  // FIXME abstract
  // calculate the most popular tag between t0 and t1
  function topActivity(har, t0, t1) {
    return getMaxOccurrence(har.map(function (d) {
      if (d.ts >= t0 && d.ts <= t1) { // get tags between t0 and t1
        return d.tag.replace(/\"/g, ""); // remove quotes
      }}).filter(function (d) { return d; }) // remove undefined
    );
  }

  /* SENSOR DATA */

  // merge two sensor data arrays, sorted w/o duplicates
  Array.prototype.merge = function(array) {
    if (!this.length) return array;
    if (!array.length) return this;

    // sort by timestamp first, then remove the ones where a[i+1].endtime is
    // bigger than a[i].endtime

    return this.concat(array)
      .sort(function(a,b) {
        return d3.ascending(a.ts, b.ts);
      })
      .filter(function(d,i,a) { // true returns d
        return (a[i+1] ? (a[i].endtime <= a[i+1].endtime) : true);
      })
      .filter(function(d,i,a) { // FIXME there are still remaining entries after the first filter run
        return (a[i+1] ? (a[i].endtime <= a[i+1].endtime) : true);
      });
  };

  /* D3 */

  Array.prototype.calculateExtent = function(a) {  // e.g. ['avgx, avgy, avgz']
    return d3.extent(this.select(a)).map(function(d) {
      return +d;
    });
  };


  // http://stackoverflow.com/q/5971645/220472
  // var jdn = function(y, m, d) {
  // var tmp = (m <= 2 ? -1 : 0);
  // return ~~((1461 * (y + 4800 + tmp)) / 4) +
  //        ~~((367 * (m - 2 - 12 * tmp)) / 12) -
  //        ~~((3 * ((y + 4900 + tmp) / 100)) / 4) +
  //        d - 2483620;
  // };


}())