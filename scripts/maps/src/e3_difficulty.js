import * as d3 from 'd3';

let state = {};

function render_e3(element, data, grade) {
    let climbs = data.slice();
    if (grade !== "All") {
        climbs = data.filter(d => d.grade === grade);
    }

    let color = function (x) {
        return d3.scaleSequential(d3.interpolateMagma)
            .domain([1.0e-9, 1.0e-7])(x);
    }

    let climb_elements = element
        .selectAll("path")
        .data(d3.contourDensity()
            .x( d => d.x )
            .y( d => d.y )
            .size([700000, 1300000])
            .cellSize(5000)
            .bandwidth(8000)
            (climbs));

    climb_elements
         .exit()
         .remove();

    climb_elements
        .enter()
        .append("path")
        .merge(climb_elements)
        .attr("class", "e3-contour")
        .attr("fill", d => color(d.value))
        .attr("d", d3.geoPath());
}

function render_tooltips(element, crags) {
    let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    element.selectAll("crags")
        .data(crags)
    .enter().append("circle")
        .attr("r", 10000)
       // .attr("fill", "none")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html("<a href=\"" + d.url + "\">" + d.name + "</a>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

$(document).ready( () => {

    function parseRow(row) {
        return {
            id: row.climb_id,
            grade: row.technical_grade,
            x: parseFloat(row.eastings),
            y: parseFloat(row.northings)
        }
    }

    function parseCragRow(row) {
        return {
            id: row.crag_id,
            name: row.name_crag,
            x: parseFloat(row.eastings),
            y: parseFloat(row.northings),
            url: "https://www.ukclimbing.com/logbook/crag.php?id=" + row.crag_id
        };
    }

    Promise.all([
        d3.svg("/images/uk_1.svg"),
        d3.svg("/images/uk_2.svg"),
        d3.csv("/data/e3.csv", parseRow),
        d3.csv("/data/e3_crags.csv", parseCragRow)
    ]).then((result) => {
        let svg_1 = result[0];
        let svg_2 = result[1];
        let data = result[2];
        let e3_crags = result[3];
        state.data = data;
            $("#map_1").append($(svg_1.documentElement));
            $("#map_2").append($(svg_2.documentElement));
            $("#uk_1_label").html("All");
            $("#uk_2_label").html("5b");
            render_e3(d3.select('#uk_1_crags'), data, 'All');
            render_e3(d3.select('#uk_2_crags'), data, '5b');
       // render_tooltips(d3.select('#uk_1_crags'), e3_crags);
    });

    $(".dropdown-item").click((evt) => {
        let item = evt.target;
        let grade = item.innerText;
        let menu_element = $(item).parents(".dropdown").find(".btn");
        let map = menu_element.attr("id").substring(0,4);
        $("#" + map + "_label").html(grade);
        render_e3(d3.select("#" + map + "_crags"), state.data, grade);
    });
});
