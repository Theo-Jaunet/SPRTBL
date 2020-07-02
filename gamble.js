function displayMatrix(matrix, svg, svgWidth, svgHeight, gap = false, morph = false, lines = true, labels = [], labels2 = []) {
    let marginw = 0;
    let marginh = 0;

    if (labels.length > 0) {
        marginw = svgWidth * 0.15;
        svgWidth = svgWidth * 0.85;

        marginh = svgHeight * 0.15;
        svgHeight = svgHeight * 0.85;
    }


    const padding = 3;
    const rectSize = Math.min(((svgWidth) - (padding * matrix.length + 2)) / matrix.length, (svgHeight - (padding * matrix[0].length + 2)) / matrix[0].length);
    const max = getMax(matrix);

    const hscale = d3.scaleSqrt().domain([0, max]).range([(gap ? 1 : rectSize), 50]);

    let color = d3.scaleLinear().domain([0, max]).range(['#fffacd', '#cf582f']).interpolate(d3.interpolateHcl);
    let lanes = d3.range(matrix.length).map(d => []);
    lanes.push([]);

    for (let i = 0; i < matrix.length; i++) {
        let cumul = marginw + padding;

        if (labels.length > 0) {
            svg.append("text")
                .attr('x', 120)
                .attr("text-anchor", "end")
                .attr("y", marginh + padding + (rectSize + padding) * i + rectSize / 2)
                .style("font-size", "9pt")
                .attr('line', i)
                .text(labels[i]);
        }

        for (let j = 0; j < matrix[0].length; j++) {

            if (i === 0) {
                if (labels.length > 0) {
                    svg.append('text')
                        .attr("x", -(marginw * 0.4) + (rectSize / 2) + marginw + (rectSize + padding) * j)
                        .attr("y", marginh * 0.44)
                        .style("font-size", "9pt")
                        .attr("transform", "rotate(-85," + ((rectSize / 2) + marginw + (rectSize + padding) * j + 1) + ",50)")
                        .attr("col", j)
                        .text((labels2.length > 0 ? labels2[j] : labels[j]));

                    lanes[i].push([(rectSize / 2) + marginw + (rectSize + padding) * j, 2, j, marginh - 25])
                }
            }

            svg.append("rect")
                .attr("x", cumul)
                .attr("y", marginh + padding + (rectSize + padding) * i)
                .attr("width", (morph ? hscale(matrix[i][j]) : (gap && matrix[i][j] === 0 ? 1 : rectSize)))
                .attr("height", rectSize)
                .attr('line', i)
                .attr("col", j)
                .attr("fill", (matrix[i][j] === 0 ? '#e3e3e3' : (morph ? 'steelblue' : color(matrix[i][j]))));

            if (lines) {
                let temp = 0;
                if (morph) {
                    temp = hscale(matrix[i][j]) / 2
                } else if (gap && matrix[i][j] !== 0) {
                    temp = rectSize / 2
                }
                lanes[i + 1].push([cumul + temp, 0, j, marginh + padding + (rectSize + padding) * i]);
                lanes[i + 1].push([cumul + temp, 1, j, marginh + padding + (rectSize + padding) * i]);
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

function displayTable(matrix, svg, svgWidth, svgHeight, gap = false, lines = true, labels = [], labels2 = []) {
    const padding = 5;

    let marginw = 0;
    let marginh = 0;

    if (labels.length > 0) {
        marginw = svgWidth * 0.15;
        svgWidth = svgWidth * 0.85;

        marginh = svgHeight * 0.15;
        svgHeight = svgHeight * 0.85;
    }

    const rectSize = 15;
    const max = getMax(matrix);
    const hscale = d3.scaleSqrt().domain([0, max]).range([(gap ? 1 : rectSize), 50]);

    // let color = d3.scaleLinear().domain([0, max]).range(['#ffffe1', '#cf582f']).interpolate(d3.interpolateHcl);
    let lanes = d3.range(matrix.length).map(d => []);

    for (let i = 0; i < matrix.length; i++) {
        let cumul = marginw + padding;

        if (labels.length > 0) {
            svg.append("text")
                .attr('x', 150)
                .attr("text-anchor", "end")
                .attr("y", marginh + padding + (rectSize + padding) * i + rectSize / 2)
                .style("font-size", "9pt")
                .attr('line', i)
                .text(labels[i]);
        }

        svg.append("rect")
            .attr("x", 0)
            .attr("y", marginh + 13 + padding + (15 + padding) * i)
            .attr('width', svgWidth)
            .attr("height", 1);

        for (let j = 0; j < matrix[0].length; j++) {

            let wid = 1;
            if (matrix[i][j] !== "") {

                let txt = svg.append("text")
                    .attr("x", cumul)
                    .attr("y", marginh + 10 + padding + (15 + (padding)) * i)

                    .text(matrix[i][j]);

                wid = txt._groups[0][0].getComputedTextLength()

            }

            if (i === 0) {

                if (labels.length > 0) {
                    svg.append('text')
                        .attr("x", -(marginw * 0.55) + (rectSize / 2) + marginw + (rectSize + padding) * j)
                        .attr("y", marginh * 0.35)
                        .style("font-size", "9pt")
                        .attr("transform", "rotate(-85," + ((rectSize / 2) + marginw + (rectSize + padding) * j + 1) + ",50)")
                        .attr("col", j)
                        .text((labels2.length > 0 ? labels2[j] : labels[j]));

                    lanes[i].push([(rectSize / 2) + marginw + (rectSize + padding) * j, 2, j, marginh - 25])
                }
            }

            if (lines) {

                let temp = 0;
                if (gap && matrix[i][j] !== "") {
                    temp = wid / 2
                }
                lanes[i].push([cumul + temp, 0, j, marginh + padding + (rectSize + padding) * i]);
                lanes[i].push([cumul + temp, 1, j, marginh + padding + (rectSize + padding) * i]);
            }
            if (gap) {
                cumul += (matrix[i][j] === 0 ? 1 : wid)
            } else {
                cumul += rectSize + 10
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
        // for (let i = 0; i < 1; i++) {
        let dat = getCol(lanes, i);

        console.log(dat);

        let line = d3.line()
            .x(function (d) {
                return d[0];
            })
            .y(function (d) {
                if (d[1] !== 1) {
                    return d[3]

                } else {
                    return d[3] + height * 0.8
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
    // d3.selectAll('path').moveToBack()

}

d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

function getMax(a) {
    return Math.max(...a.map(e => Array.isArray(e) ? getMax(e) : e));
}