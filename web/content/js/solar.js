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
            dash: "dot",
        },
        x: unpack(rows, 'time'),
        y: unpack(rows, 'dc'),
    };

    var d116 = {
        type: "scatter",
        mode: "lines",
        name: "Bytes 116-119 (<I)",
        line: {
            dash: "solid",
        },
        x: unpack(rows, 'time'),
        y: unpack(rows, 'bytes'),
    }

    var data = [dcv, d116];

    var layout = {
        'title': "Result of correlation algorithm (Offset for illustration purposes)"
    };

    Plotly.newPlot(inverter, data, layout, {displayModeBar: false, responsive: true});
});