(function () {
  'use strict';

  // var t = new Date();

  if (!d3.custom) d3.custom = {};

  d3.custom.lineChart = function module() {

    // default values. may be overwritten by exported functions.

    var margin = {top: 8, right: 8, bottom: 40, left: 40},
        width = d3.select(this)[0].parentNode.offsetWidth - ((margin.left + margin.right)*3) - 1,
        height = 120,
        xScale = d3.time.scale().range([0, width]),
        yScale = d3.scale.linear().range([height, 0]),
        xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(Math.max(width/75, 2)),
        yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(Math.max(height/25, 2)),
        brush = d3.svg.brush(),
        extent = [];

    var svg;

    var dispatch = d3.dispatch('brushended', 'ready');

    function exports(selection) {
      selection.each(function (d, i) {
        if (!d) return;

        var data = d.data;

        if (extent.length) {
          xScale.domain(extent);
        } else {
          xScale.domain(d3.extent([].concat.apply([], data.map(function(d) {return [d.starttime, d.endtime]; }))));
        }
          
        var line = d3.svg.line().interpolate("linear")
          .x(function(d) { return xScale(d[0]); })
          .y(function(d) { return yScale(d[1]); });

        // FIXME this is probably wrong and causes all the trouble
        if (!d3.select(this).select('svg')[0][0]) { // why not (!svg)?
          svg = d3.select(this)
                .append('svg')
                  .classed('chart', true)
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("defs")
                .append("clipPath")
                  .attr("id", "clip")
                .append("rect")
                  .attr("width", width)
                  .attr("height", height);
        }

        d3.select(this).selectAll('svg').selectAll("*").remove();
        // svg.selectAll("*").remove(); // why not?

        svg = d3.select(this).selectAll('svg').data(data);

        brush.x(xScale)
          .on("brushend", brushended);

        var chart = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "chart");

        // x-graph
        chart.append("path")
          .attr("class", "line line0")
          .attr("clip-path", "url(#clip)")
          .attr("d", line(data.map(function(d) { return [d.ts, d.avgx]; })));

        // y-graph
        chart.append("path")
          .attr("class", "line line1")
          .attr("clip-path", "url(#clip)")
          .attr("d", line(data.map(function(d) { return [d.ts, d.avgy]; })));

        // z-graph
        chart.append("path")
          .attr("class", "line line2")
          .attr("clip-path", "url(#clip)")
          .attr("d", line(data.map(function(d) { return [d.ts, d.avgz]; })));

        // x-axis
        chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height + 3) + ")")
          .call(xAxis);

        // y-axis
        chart.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(-3,0)")
          .call(yAxis);

        chart.append("g")
          .attr("class", "brush")
          .call(brush)
        .selectAll("rect")
          .attr("height", height);



        var chartName = this.getAttribute('data').split('.')[1].toUpperCase();

        // console.log(chartName, 'CHART DOMAIN XSCALE', xScale.domain().map(function (d) { return +d; }));
        // console.log(chartName, 'CHART DOMAIN YSCALE', yScale.domain());
        // console.log(chartName, 'CHART RANGE  XSCALE', xScale.range());
        // console.log(chartName, 'CHART RANGE  YSCALE', yScale.range());
        // console.log('--------------------------------------------------');



        function brushended() {
          // if (brush.empty()) return;

          // console.log('CHART EXTENT 1:', brush.extent().map(function (d) { return +d; }), extent);
          dispatch.brushended(brush.empty() ? [] : brush.extent().map(function (d) { return +d; }));

          // this first clears the brush, and then tells it to redraw
          // https://groups.google.com/d/msg/d3-js/SN4-kJD6_2Q/SmQNwLm-5bwJ
          chart.select(".brush").call(brush.clear());

          console.log(chartName, brush.extent());
          xScale.domain(brush.extent()); // scale the x-domain to the extent (zoom in)

          // transition is for debugging purposes (to see what's happening)

          // FIXME only the axis of the last drawn chart is selected, not 'this' one
          svg.transition().duration(2000).select(".x.axis").call(xAxis);

          svg.transition().duration(2000).selectAll(".line0").attr("d", line(data.map(function (d) { return [d.ts, d.avgx]; })));
          svg.transition().duration(2000).selectAll(".line1").attr("d", line(data.map(function (d) { return [d.ts, d.avgy]; })));
          svg.transition().duration(2000).selectAll(".line2").attr("d", line(data.map(function (d) { return [d.ts, d.avgz]; })));

          // chart.select("brush").call(brush.clear()); // clear brush
          // chart.select("brush").call(brush); // call new brush
          // svg.select(".x.axis").call(xAxis); // rescale x axis

          // scale x domain to brush extent (zoom in)
          // brush.clear();
          
          // transition_data();
          // reset_axis();
          // brush.clear();
          // chart.select("brush").call(brush.clear());
          // chart.select("brush").call(brush);

          // redraw the graph lines

          // brush.clear();
          // reset_axis();
          // clear the brush and call a new one
          // chart.select("brush").call(brush.clear());
          // chart.select("brush").call(brush);
          // clear_brush();
        }

        // function transition_data() {
        //   this.svg.selectAll(".line0").attr("d", line(data.map(function (d) { return [d.ts, d.avgx]; })));
        //   this.svg.selectAll(".line1").attr("d", line(data.map(function (d) { return [d.ts, d.avgy]; })));
        //   this.svg.selectAll(".line2").attr("d", line(data.map(function (d) { return [d.ts, d.avgz]; })));
        // }

        // function reset_axis() {
        //   svg.transition().duration(500)
        //     .select(".x.axis")
        //     .call(xAxis);
        // }

        // function clear_brush() {
        //   if (!data) { console.error('clear_brush has no data'); return; }
        //   xScale.domain(d3.extent([].concat.apply([], data.map(function (d) { return [d.starttime, d.endtime]; }))));
        //   transition_data();
        //   reset_axis();
        // }
      });
    }

    // clear brush means:
    // 1. scale x domain to extent
    // 2. draw the three lines
    // 3. call x axis

    exports.width = function(_) {
      if (!arguments.length) return width;
      width = parseInt(_);
      return this;
    };

    exports.height = function(_) {
      if (!arguments.length) return height;
      height = parseInt(_);
      duration = 0;
      return this;
    };

    // to update the x-domain with the brush'es extent
    exports.xScale = function(_) {
      if (!arguments.length) return xScale;
      xScale = xScale.domain(_);
      return this;
    };

    // to update the y-domain when it changes FIXME: release watch after final
    // y-domain has been calculated (or better calculate all domains first and
    // then draw stuff)
    exports.yScale = function(_) {
      if (!arguments.length) return yScale;
      yScale = yScale.range([height, 0]).domain(_);
      return this;
    };

    exports.extent = function(_) {
      if (!arguments.length) return extent; // currently set value
      // console.log('CHART EXTENT 5:', _, extent);
      extent = _;
      return this;
    };

    d3.rebind(exports, dispatch, 'on');
    return exports;
  };

  // document.addEventListener("DOMContentLoaded", function (event) {
  //   console.log("DOM fully loaded and parsed after " + (event.timeStamp - t) + " ms");
  // });

}());
