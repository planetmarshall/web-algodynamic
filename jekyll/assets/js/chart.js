/**
 * Created by andrew on 14.01.17.
 */

var graphics = graphics || [];

var chart = {

    render: function () {

        var container = d3.select('#chart');
        var svg = d3.select('.chart');

        var aspect = 4.0 / 3.0;
        var viewWidth = parseInt(container.style("width"));
        var viewHeight = Math.round(viewWidth / aspect);


        svg.attr("viewBox", "0 0 " + viewWidth + " " + viewHeight)
            .attr("preserveAspectRatio", "xMidYMid meet");

        var margin = {top: 20, right: 20, bottom: 30, left: 40};
        var height = viewHeight - margin.top - margin.bottom;
        var width = viewWidth - margin.left - margin.right;

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv("/assets/data/sneachda.csv",
            function (row) {
                return { name : row.name, value : +row.value }
            },
            function(error, data) {

            if (error) throw error;

            x.domain(data.map(function(d) { return d.name; }));
            y.domain([0, d3.max(data, function(d) { return d.value; })]);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(10, "%"))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Frequency");

            g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.name); })
                .attr("y", function(d) { return y(d.value); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return height - y(d.value); });
        });
    }
};

graphics.push(chart);


