import * as d3 from 'd3';
import * as d3_hexbin from 'd3-hexbin';

function radius(crags, max_climbs) {
    let x = d3.sum(crags, (crag) => { return +crag.num_winter_climbs; });
    let t = (x - 1.0) / (max_climbs - 1.0);
    let min_hex_size = 5.0e3;
    let max_hex_size = 2.0e4;
    return min_hex_size * (1.0 - t) + max_hex_size * t;
}

function render_hexbin(element, data, season) {
    let width = 5000000;
    let height = 5000000;
    let bin_radius = 1.0e4;
    let hexbin = d3_hexbin.hexbin()
        .x((data) => {return parseFloat(data.x);})
        .y((data) => {return parseFloat(data.y);})
        .radius(bin_radius)
        .extent([[0, 0], [width, height]]);

    let max_climbs = d3.max(data, crag => { return +crag.num_winter_climbs; });

    let color = d3.scaleSequential(d3.interpolateMagma);

    element.append("g")
      .attr("class", "hexagon")
    .selectAll("path")
    .data(hexbin(data))
    .enter().append("path")
      .attr("d", function(d) {
          return hexbin.hexagon(bin_radius);
      })
      .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
      })
      .attr("fill", d => {
          let t = d3.mean(d, crag => { return +crag[season]});
          return color(t);
      });
}

$(document).ready( () => {

    Promise.all([
        d3.svg("/images/scotland_1.svg"),
        d3.svg("/images/scotland_2.svg"),
        d3.csv("/data/winter_crags.csv")
    ]).then((result) => {
        let svg_1 = result[0];
        let svg_2 = result[1];
        let data = result[2];
            $("#map_1").append($(svg_1.documentElement));
            $("#map_2").append($(svg_2.documentElement));
            render_hexbin(d3.select('#crags_1'), data, '2017');
            render_hexbin(d3.select('#crags_2'), data, '2018');
    });

    $(".dropdown-item").click(function(){
  $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
    });
});
