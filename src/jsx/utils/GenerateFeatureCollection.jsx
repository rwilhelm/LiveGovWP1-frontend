/** @jsx React.DOM */

var GenerateFeatureCollection = {
  featureCollection: function(gps, har) {
    var fc = {
      type: 'FeatureCollection',
      features: []
    };

    function createFeature(properties, coordinates) {
      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates // [g0, g1]
        },
        properties: properties
      };
    }

    fc.features = har.map(function(properties) {
      return createFeature(properties, gps.filter(function(g) {
        return g.ts >= properties.start && g.ts <= properties.stop;
      }).map(function(position) {
        return position.lonlat.coordinates;
      }));
    }).filter(function(d) {
      return d.geometry.coordinates.length;
    });

    fc.features.forEach(function(c, i, a) {
      if (a[i + 1]) { a[i].geometry.coordinates.push(a[i + 1].geometry.coordinates[0]); }
    });

    return fc;
  }
};
