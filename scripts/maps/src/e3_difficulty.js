import * as d3 from 'd3';
import * as d3_hexbin from 'd3-hexbin';

let state = {};

function render_e3(element, data, grade) {
    let climbs = data.slice();
    if (grade !== "All") {
        climbs = data.filter(d => d.grade === grade);
    }

    let climb_elements = element
        .selectAll("circle")
        .data(climbs);

    climb_elements
        .exit()
        .remove();

    climb_elements
        .enter()
        .append("circle")
        .merge(climb_elements)
      .attr("r", 10000)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .style("fill", 'red');

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

    Promise.all([
        d3.svg("/images/uk_1.svg"),
        d3.svg("/images/uk_2.svg"),
        d3.csv("/data/e3.csv", parseRow)
    ]).then((result) => {
        let svg_1 = result[0];
        let svg_2 = result[1];
        let data = result[2];
        state.data = data;
            $("#map_1").append($(svg_1.documentElement));
            $("#map_2").append($(svg_2.documentElement));
            $("#uk_1_label").html("All");
            $("#uk_2_label").html("5b");
            render_e3(d3.select('#uk_1_crags'), data, 'All');
            render_e3(d3.select('#uk_2_crags'), data, '5b');
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
