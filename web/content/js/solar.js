inverter = document.getElementById("inverter")

Plotly.d3.csv("/data/solar.csv", function(err, rows) {
    function unpack(rows, key) {
        return rows.map(function (row) {
            return row[key];
        });
    }

    var dcv = {
        type: "scatter",
        mode: "lines",
        name: "DC Input Power (W)",
        line: {
            width: 1,
            dash: "solid",
            color: "rgba(89,4,31, 1)"
        },
        x: unpack(rows, 'time'),
        y: unpack(rows, 'dc'),
    };

    var d116 = {
        type: "scatter",
        mode: "lines",
        name: "Bytes 116-119 (<I)",
        line: {
            width: 1,
            color: "rgba(172,154,107, 1)"
        },
        x: unpack(rows, 'time'),
        y: unpack(rows, 'bytes'),
        xaxis: "x2",
        yaxis: "y2",
    }

    var data = [dcv, d116];

    var layout = {
        title: "Result of correlation algorithm (Offset for illustration purposes)",
        grid: {rows: 2, columns: 1, pattern: 'independent'},
    };

    Plotly.newPlot(inverter, data, layout, {displayModeBar: false, responsive: true});
});