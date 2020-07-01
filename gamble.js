function displayMatrix(matrix, svg, svgWidth, svgHeight, gap = false, morph = false, lines = true, labels = []) {
    const padding = 3;
    const rectSize = Math.min(((svgWidth) - (padding * matrix.length + 2)) / matrix.length, (svgHeight - (padding * matrix[0].length + 2)) / matrix[0].length);
    const max = getMax(matrix)

    const hscale = d3.scaleSqrt().domain([0, max]).range([(gap ? 1 : rectSize), 50]);

    let color = d3.scaleLinear().domain([0, max]).range(['#fffacd', '#cf582f']).interpolate(d3.interpolateHcl);
    let lanes = d3.range(matrix.length).map(d => []);
    for (let i = 0; i < matrix.length; i++) {
        let cumul = padding;
        for (let j = 0; j < matrix[0].length; j++) {

            svg.append("rect")
                .attr("x", cumul)
                .attr("y", padding + (rectSize + padding) * i)
                .attr("width", (morph ? hscale(matrix[i][j]) : (gap && matrix[i][j] === 0 ? 1 : rectSize)))
                .attr("height", rectSize)
                .attr("fill", (matrix[i][j] === 0 ? '#e3e3e3' : (morph ? 'steelblue' : color(matrix[i][j]))))

            if (lines) {
                let temp = 0;

                if (morph) {
                    temp = hscale(matrix[i][j]) / 2
                } else if (gap && matrix[i][j] !== 0) {
                    temp = hscale(matrix[i][j]) / 2
                }
                lanes[i].push([cumul + temp, 0, j]);
                lanes[i].push([cumul + temp, 1, j]);
            }

            if (morph && !gap) {
                cumul += hscale(matrix[i][j])
            } else if (gap) {
                cumul += (matrix[i][j] === 0 ? 1 : (morph ? hscale(matrix[i][j]) : rectSize))
            } else {
                cumul += rectSize;
            }
            cumul += padding
        }
    }
    if (lines) {
        drawLines(lanes, svg, rectSize + padding)
    }
}

function displayTable(matrix, svg, svgWidth, svgHeight, gap = false, lines = true, labels = []) {
    const padding = 2;
    const rectSize = Math.min((svgWidth - (padding * matrix.length + 2)) / matrix.length, (svgHeight - (padding * matrix[0].length + 2)) / matrix[0].length);

    console.log(rectSize);
    const max = getMax(matrix);

    const hscale = d3.scaleSqrt().domain([0, max]).range([(gap ? 1 : rectSize), 50]);

    let color = d3.scaleLinear().domain([0, max]).range(['#ffffe1', '#cf582f']).interpolate(d3.interpolateHcl);
    let lanes = d3.range(matrix.length).map(d => []);
    for (let i = 0; i < matrix.length; i++) {
        let cumul = padding;
        for (let j = 0; j < matrix[0].length; j++) {

            if (matrix[i][j] !== "") {

                svg.append("text")
                    .attr("x", cumul)
                    .attr("y", padding + (rectSize + padding) * i)
                    .text(matrix[i][j])

            }
            // .attr("fill", (matrix[i][j] === 0 ? '#d3d3d3' : (morph ? 'steelblue' : color(matrix[i][j]))))

            if (lines) {

                let temp = 0;
                if (gap && matrix[i][j] !== "") {
                    temp = hscale(matrix[i][j]) / 2
                }
                lanes[i].push([cumul + temp, 0, j]);
                lanes[i].push([cumul + temp, 1, j]);
            }
            if (gap) {
                cumul += (matrix[i][j] === 0 ? 1 : rectSize)
            } else {
                cumul += (rectSize * 2);
            }
            cumul += padding * 2
        }
    }
    if (lines) {
        drawLines(lanes, svg, rectSize + padding)
    }
}


function getCol(lanes, id) {
    let dat = [];
    for (let i = 0; i < lanes.length; i++) {
        dat = dat.concat(lanes[i].filter(d => (d[2] === id)))
    }
    return dat;
}

function drawLines(lanes, svg, height) {


    for (let i = 0; i < lanes.length; i++) {
        let dat = getCol(lanes, i)

        let line = d3.line()
            .x(function (d) {
                return d[0];
            })
            .y(function (d, i) {
                if (d[1] === 0) {
                    return 5 + (height * (i / 2));
                } else {
                    return (height * ((i + 1) / 2));
                }
            })
            .curve(d3.curveLinear);

        svg.append("path")
            .data([dat])
            .attr("d", line)
            .attr('stroke-width', 1)
            .attr('stroke', '#5b5b5b')
            .attr("col", i)
            .attr('fill', 'none')
    }

}

function getMax(a) {
    return Math.max(...a.map(e => Array.isArray(e) ? getMax(e) : e));
}