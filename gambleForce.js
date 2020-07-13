let rects;
let graphLayout;
let compfact;
let offx = 0;
let offy = 0;


function draw(matrix, svg, lineBool, morphBool, direction, compress, labels = [], labels2 = []) {

    if (labels.length > 0) {
        offx = 900 * 0.15;
        offy = 900 * 0.15;
    }

    compfact = 1 - (compress / 5.8);
    svg.selectAll("*").remove();
    const padding = 4;
    const rectSize = (900 - (padding * matrix.length) - offx) / matrix.length

    const max = getMax(matrix);
    let color = d3.scaleLinear().domain([0, max]).range(['#fbf7b9', '#cf582f']).interpolate(d3.interpolateHcl);
    let lanes = d3.range(matrix.length).map(d => []);

    const hscale = d3.scaleSqrt().domain([0, max]).range([2, rectSize * morphBool]);

    // console.log(matrix);

    let tlinks = [];
    let trec = [];
    let sparseacc = 0;
    for (let i = 0; i < matrix.length; i++) {


        if (labels.length > 0) {
            svg.append("text")
                .attr('x', 120)
                .attr("text-anchor", "end")
                .attr("y", offx + padding + (rectSize + padding) * i + rectSize / 2)
                .style("font-size", "9pt")
                .attr('line', i)
                .text(labels[i]);
        }

        // let g = ;
        for (let j = 0; j < matrix[0].length; j++) {

            if (i === 0) {
                if (labels.length > 0) {
                    svg.append('text')
                        .attr("x", -(offx * 0.54) + (rectSize / 2) + offx + (rectSize + padding) * j)
                        .attr("y", offy * 0.3)
                        .style("font-size", "9pt")
                        .attr("transform", "rotate(-85," + ((rectSize / 2) + offx + (rectSize + padding) * j + 1) + ",50)")
                        .attr("col", j)
                        .text((labels2.length > 0 ? labels2[j] : labels[j]));


                }
            }


            let wid;


            if (matrix[i][j] === 0) {
                sparseacc++
            }

            if (morphBool === 0) {
                wid = (matrix[i][j] == 0 ? 1 : rectSize)
            } else {
                wid = hscale(matrix[i][j]);
            }
            trec.push({
                x: ((rectSize + padding) * j) + wid,
                y: ((rectSize + padding) * i) + wid,
                line: i,
                col: j,
                id: j + "-" + i,
                val: matrix[i][j],
                ory: ((rectSize + padding) * i),
                orx: ((rectSize + padding) * j),
                // width: wid
                width: wid
            });

            if (j > 0) {
                tlinks.push({
                    source: j + "-" + i,
                    target: (j - 1) + "-" + i,
                    val: '1'
                })
            }
            if (i > 0) {

                tlinks.push({
                    source: j + "-" + (i - 1),
                    target: j + "-" + (i - 1),
                    val: '1'
                })
            }
        }
    }


    rects = svg.append("g")
        .selectAll("rect")
        .data(trec)
        .enter()
        .append("rect")
        .attr('x', offx)
        .attr('y', offy)
        .attr("width", rectSize)
        .attr("height", rectSize)
        .attr("col", d => d.col)
        .attr("line", d => d.line)
        .attr("fill", d => (d.val === 0 ? "#d3d3d3" : color(d.val)))
        // .call(force.drag)
        .attr("transform", d => "translate(" + (d.x - d.width) + "," + (d.y - d.width) + ")");

    graphLayout = makeForce(direction, trec, tlinks, compress);

    setTimeout(function () {
        graphLayout.restart();
        // console.log("lala");
    }, 1750);


    setTimeout(function () {
        graphLayout.stop();
        console.log("DONE");
        if (direction === "left") {
            rects.transition().duration(1850).attr("width", d => d.width)
                .attr("transform", function (d, i) {
                        return "translate(" + (d.x) + "," + d.y + ")";
                    }
                )
        } else if (direction === "top") {
            rects.transition().duration(1850).attr("height", d => d.width)
                .attr("transform", function (d, i) {
                        return "translate(" + (d.x) + "," + d.y + ")";
                    }
                )
        }
        // .on("end", animLines);
        let line = d3.line()
            .x(function (d) {
                if (direction == "left") {
                    return d.x + (d.width / 2) + offx
                } else (direction == "top")
                {
                    return d.x + rectSize / 2 + offx
                }
            })
            .y(function (d) {
                return d.y + offy
            })
            .curve(d3.curveLinear);

        let sum = 0;
        // if (direction === "left") {
        for (let i = 0; i < matrix[0].length; i++) {

            if (direction === "left")
                sum += getCurve(rects2line(rects.data(), i, (rectSize + padding / 2)))

            let lune = rects2line(rects.data(), i, (rectSize + padding / 2))

            lune.unshift({x: (rectSize + padding) * (i - 1), y: -12, width: 3});


            svg.append("path")
                .data([lune])
                // .data([rects2line(rects.data(), i, (rectSize + padding / 2))])
                .attr("d", line)
                .attr('stroke-width', 1)
                .attr('stroke', '#5b5b5b')
                .attr('fill', 'none')
                .attr("col", i)
                .attr("class", "vlines")
                .attr('opacity', 0)
                .transition()
                .duration(2900)
                .attr('opacity', lineBool[1])


        }
        // }
        // if (direction === "top") {

        for (let i = 0; i < matrix.length; i++) {

            let lune = rects.data().filter(d => d.line === i)


            if (direction === "top")
                sum += getCurve(lune)


            lune.unshift({x: -12, y: (padding + (rectSize + padding) * (i - 1) + rectSize), width: 3});


            svg.append("path")
                .data([lune])
                // .data([rects2line(rects.data(), i, (rectSize + padding / 2))])
                .attr("d", line)
                .attr('stroke-width', 1)
                .attr('stroke', '#5b5b5b')
                .attr('fill', 'none')
                .attr("line", i)
                .attr("class", "hlines")
                .attr('opacity', 0)
                .transition()
                .duration(2900)
                .attr('opacity', lineBool[0])

        }
        // }

        if (!inFront)
            d3.selectAll("path").moveToBack();
        applyStats(rects2line(rects.data(), matrix[0].length - 1, (rectSize + padding / 2)), rectSize, padding, matrix[0].length, sum / matrix[0].length, sparseacc / (matrix.length * matrix[0].length), matrix.length, matrix[0].length)

    }, 3500);
}

function rects2line(data, id, margin) {
    return data.filter(d => d.col === id).map(function (item) {
        let item2 = JSON.parse(JSON.stringify(item));
        item2.y = item.y + margin
        return [item, item2];
    }).reduce(function (a, b) {
        return a.concat(b)
    });
}


function tickedTop() {


    rects.each(function (nodePos, i, a) {

        nodePos.x = nodePos.orx;
        if (nodePos.x < 5)
            nodePos.x = 5;

        if (nodePos.line === 0) {
            nodePos.y = 5
        }
        if (nodePos.line > 0) {

            let prev = rects.data().filter(d => d.line === nodePos.line - 1 && d.col === nodePos.col)[0];

            if (nodePos.y < prev.y + prev.width) {

                nodePos.y = nodePos.y + Math.abs(nodePos.y - (prev.y + prev.width)) + 1

            } else if ((prev.y + prev.width) - nodePos.y > 5) {
                // nodePos.x = nodePos.x -5
            }
        }
    });

    // rects.attr("transform", function (d, i) {
    //     return "translate(" + (d.x) + "," + d.y + ")";
    // });
}


function tickedLeft() {


    rects.each(function (nodePos, i, a) {

        nodePos.y = nodePos.ory;
        if (nodePos.x < 5)
            nodePos.x = 5
        /*
                        if (nodePos.x > 500)
                            nodePos.x = 500*/

        if (nodePos.col === 0) {
            nodePos.x = 5
        }
        if (nodePos.col > 0) {
            let prev = rects.data()[i - 1];

            if (nodePos.x < prev.x + prev.width) {

                nodePos.x = nodePos.x + Math.abs(nodePos.x - (prev.x + prev.width)) + 6 * compfact

            } else if ((prev.x + prev.width) - nodePos.x > 5) {
                // nodePos.x = nodePos.x -5
            }
        }

    });


    // rects.attr("transform", function (d, i) {
    //     return "translate(" + (d.x) + "," + d.y + ")";
    // });
}


function makeForce(direction, trec, tlinks, compress) {
    let simulation = d3.forceSimulation(trec).alpha(0.38);
    simulation.stop();
    // console.log("dasdas" + compress);
    switch (direction) {
        case "left":
            simulation
                // .force("link", d3.forceLink(tlinks).id(d => d.id).strength(1).distance(0.5))
                // .force('collision', d3.forceCollide().iterations(4).radius(function (d) {
                //     // console.log(d.width);
                //     return d.width / 2
                // }).strength(0.2))
                // .force("charge", d3.forceManyBody().distanceMin(d => 5)).strength(-50))
                .force("x", d3.forceX(0).strength(compress))
                .on("tick", tickedLeft);
            break;
        case "top":
            simulation.force("charge", d3.forceManyBody().distanceMin(d => 5).distanceMax(5).strength(-50))
                .force("y", d3.forceY(0).strength(1))
                .on("tick", tickedTop);
            break;
        case "right":

            break;
        case "bottom":

            break;

    }
    return simulation
}


function drawTable(matrix, svg, lineBool, direction, compress, labels = [], labels2 = []) {

    svg.selectAll("*").remove();
    const padding = 0.1;
    const rectSize = 15;


    if (labels.length > 0) {
        offx = 900 * 0.15;
        offy = 900 * 0.15;
    }

    // const max = getMax(matrix);
    // let color = d3.scaleLinear().domain([0, max]).range(['#fffacd', '#cf582f']).interpolate(d3.interpolateHcl);
    let lanes = d3.range(matrix.length).map(d => []);

    // const hscale = d3.scaleSqrt().domain([0, max]).range([2, rectSize]);

    // console.log(matrix);
    let sparseacc = 0;
    let tlinks = [];
    let trec = [];
    for (let i = 0; i < matrix.length; i++) {

        if (labels.length > 0) {
            svg.append("text")
                .attr('x', 120)
                .attr("text-anchor", "end")
                .attr("y", offx + padding + (rectSize + padding) * i + rectSize / 2)
                .style("font-size", "9pt")
                .attr('line', i)
                .text(labels[i]);
        }


        // let g = ;
        for (let j = 0; j < matrix[0].length; j++) {

            if (i === 0) {
                if (labels.length > 0) {
                    svg.append('text')
                        .attr("x", -(offx * 0.54) + (rectSize / 2) + offx + (rectSize + padding) * j)
                        .attr("y", offy * 0.3)
                        .style("font-size", "9pt")
                        .attr("transform", "rotate(-85," + ((rectSize / 2) + offx + (rectSize + padding) * j + 1) + ",50)")
                        .attr("col", j)
                        .text((labels2.length > 0 ? labels2[j] : labels[j]));


                }
            }

            let wid = 1;
            if (/^\d*\.?\d+$/.test(matrix[i][j])) {
                wid = 7.5 * matrix[i][j].length
            } else {
                sparseacc++
            }
            trec.push({
                x: ((rectSize + padding) * j) + wid,
                y: ((rectSize + padding) * i) + wid,
                line: i,
                col: j,
                id: j + "-" + i,
                val: (wid === 1 ? '' : Math.round(matrix[i][j])),
                ory: ((rectSize + padding) * i),
                orx: ((rectSize + padding) * j),
                // width: wid
                width: wid
            });

            if (j > 0) {
                tlinks.push({
                    source: j + "-" + i,
                    target: (j - 1) + "-" + i,
                    val: '1'
                })
            }
            if (i > 0) {

                tlinks.push({
                    source: j + "-" + (i - 1),
                    target: j + "-" + (i - 1),
                    val: '1'
                })
            }
        }
    }


    rects = svg.append("g")
        .selectAll("text")
        .data(trec)
        .enter()
        .append("text")
        .attr("x", 10 + offx)
        .attr("y", 10 + offy)
        .attr("class", "valu")
        // .attr("width", rectSize)
        // .attr("height", rectSize)
        .attr("col", d => d.col)
        .attr("line", d => d.line)
        // .attr("fill", d => (d.val === 0 ? "#d3d3d3" : color(d.val)))
        // .call(force.drag)
        .text(d => d.val)
        .attr("transform", d => "translate(" + (d.x) + "," + (d.y) + ")");


    graphLayout = makeForce(direction, trec, tlinks, compress);


    /*      d3.forceSimulation(trec).alpha(0.08)

          .force("link", d3.forceLink(tlinks).id(d => d.id).strength(1).distance(0.5))
          .force('collision', d3.forceCollide().iterations(4).radius(function (d) {
              // console.log(d.width);
              return d.width / 2
          }).strength(0.2))
          .force("charge", d3.forceManyBody().distanceMin(d => 5).distanceMax(5).strength(-50))
          .force("x", d3.forceX(0).strength(5))
          // .force("center", d3.forceCenter([450, 450]))
          .on("tick", tickedLeft);
      graphLayout.stop();*/

    setTimeout(function () {
        graphLayout.restart();
        // console.log("lala");


        setTimeout(function () {
            graphLayout.stop();
            console.log("DONE");
            rects.transition().duration(1850).attr("width", d => d.width)
                .attr("transform", function (d, i) {
                        return "translate(" + (d.x) + "," + d.y + ")";
                    }
                )
            // .on("end", animLines);
            let line = d3.line()
                .x(function (d) {
                    if (direction == "left") {
                        return d.x + (d.width / 2) + offx
                    } else (direction == "top")
                    {
                        return d.x + rectSize / 2 + offx
                    }
                })
                .y(function (d) {
                    return d.y + offy
                })
                .curve(d3.curveLinear);

            let sum = 0;
            // if (direction === "left") {
            for (let i = 0; i < matrix[0].length; i++) {

                if (direction === "left")
                    sum += getCurve(rects2line(rects.data(), i, (rectSize + padding / 2)))

                let lune = rects2line(rects.data(), i, (rectSize + padding / 2))

                lune.unshift({x: (rectSize + padding) * (i - 1), y: -12, width: 3});


                svg.append("path")
                    .data([lune])
                    // .data([rects2line(rects.data(), i, (rectSize + padding / 2))])
                    .attr("d", line)
                    .attr('stroke-width', 1)
                    .attr('stroke', '#5b5b5b')
                    .attr('fill', 'none')
                    .attr("col", i)
                    .attr("class", "vlines")
                    .attr('opacity', 0)
                    .transition()
                    .duration(2900)
                    .attr('opacity', lineBool[1])


            }
            // }
            // if (direction === "top") {

            for (let i = 0; i < matrix.length; i++) {

                let lune = rects.data().filter(d => d.line === i)


                if (direction === "top")
                    sum += getCurve(lune)


                lune.unshift({x: -12, y: (padding + (rectSize + padding) * (i - 1) + rectSize), width: 3});


                svg.append("path")
                    .data([lune])
                    // .data([rects2line(rects.data(), i, (rectSize + padding / 2))])
                    .attr("d", line)
                    .attr('stroke-width', 1)
                    .attr('stroke', '#5b5b5b')
                    .attr('fill', 'none')
                    .attr("line", i)
                    .attr("class", "hlines")
                    .attr('opacity', 0)
                    .transition()
                    .duration(2900)
                    .attr('opacity', lineBool[0])

            }
            // }
            applyStats(rects2line(rects.data(), matrix[0].length - 1, (rectSize + padding / 2)), rectSize, padding, matrix[0].length, sum / matrix[0].length, sparseacc / (matrix.length * matrix[0].length), matrix.length, matrix[0].length)

        }, 3500);
    }, 2500);
}


function drawQuant(matrix, svg, lineBool, morphBool, direction, compress, labels = [], labels2 = []) {

    if (labels.length > 0) {
        offx = 900 * 0.15;
        offy = 900 * 0.15;
    }

    compfact = 1 - (compress / 5.8);
    svg.selectAll("*").remove();
    const padding = 4;
    const rectSize = (900 - (padding * matrix.length) - offx) / matrix.length

    const max = getMax(matrix);
    let color = d3.scaleLinear().domain([0, max]).range(['#fbf7b9', '#cf582f']).interpolate(d3.interpolateHcl);
    let lanes = d3.range(matrix.length).map(d => []);

    const hscale = d3.scaleSqrt().domain([0, max]).range([2, rectSize * 5]);

    // console.log(matrix);

    let tlinks = [];
    let trec = [];
    let sparseacc = 0;
    for (let i = 0; i < matrix.length - 1; i++) {


        if (labels.length > 0) {
            svg.append("text")
                .attr('x', 120)
                .attr("text-anchor", "end")
                .attr("y", offy + padding + (rectSize + padding) * i + rectSize / 2)
                .style("font-size", "9pt")
                .attr('line', i)
                .text(labels[i]);
        }

        // let g = ;
        for (let j = 0; j < matrix[0].length; j++) {

            if (i === 0) {
                if (labels.length > 0) {
                    svg.append('text')
                        .attr("x", -(offx * 0.54) + (rectSize / 2) + offx + (rectSize + padding) * j)
                        .attr("y", offy * 0.3)
                        .style("font-size", "9pt")
                        .attr("transform", "rotate(-85," + ((rectSize / 2) + offx + (rectSize + padding) * j + 1) + ",50)")
                        .attr("col", j)
                        .text((labels2.length > 0 ? labels2[j] : labels[j]));
                }
            }
            let wid;

            if (matrix[i][j] === 0) {
                sparseacc++
            }

            // if (j < matrix[0].length - 1) {
            console.log(matrix[i][matrix[0].length - 1]);

            wid = (matrix[i][matrix[0].length - 1] === 0 ? 1 : rectSize);
            // } else {
            // wid = hscale(matrix[i][j]);
            // }
            trec.push({
                x: ((rectSize + padding) * j) + wid,
                y: ((rectSize + padding) * i) + wid,
                line: i,
                col: j,
                id: j + "-" + i,
                val: (j === matrix[0].length - 1 ? hscale(matrix[i][j]) : 0),
                bob: matrix[i][j],
                ory: ((rectSize + padding) * i),
                orx: ((rectSize + padding) * j),
                // width: wid
                width: wid
            });

            if (j > 0) {
                tlinks.push({
                    source: j + "-" + i,
                    target: (j - 1) + "-" + i,
                    val: '1'
                })
            }
            if (i > 0) {

                tlinks.push({
                    source: j + "-" + (i - 1),
                    target: j + "-" + (i - 1),
                    val: '1'
                })
            }
        }
    }


    rects = svg.append("g")
        .selectAll("rect")
        .data(trec)
        .enter()
        .append("rect")
        .attr('x', offx)
        .attr('y', offy)
        .attr("width", rectSize)
        .attr("height", rectSize)
        .attr("col", d => d.col)
        .attr("line", d => d.line)
        .attr("fill", d => (d.bob === 0 ? "#d3d3d3" : color(d.bob)))
        // .call(force.drag)
        .attr("transform", d => "translate(" + (d.x - d.width) + "," + (d.y - d.width) + ")");

    graphLayout = makeForce(direction, trec, tlinks, compress);

    setTimeout(function () {
        graphLayout.restart();
        // console.log("lala");
    }, 1750);


    setTimeout(function () {
        graphLayout.stop();
        console.log("DONE");
        if (direction === "left") {
            rects.transition().duration(1850).attr("width", d => d.width)
                .attr("transform", function (d, i) {
                        return "translate(" + (d.x) + "," + d.y + ")";
                    }
                )
        } else if (direction === "top") {
            rects.transition().duration(1850).attr("width", d => (d.val > 0 ? d.val : d.width))
                .attr("transform", function (d, i) {
                        return "translate(" + (d.x) + "," + d.y + ")";
                    }
                )
        }
        // .on("end", animLines);
        let line = d3.line()
            .x(function (d) {
                if (direction == "left") {
                    return d.x + (d.width / 2) + offx
                } else (direction == "top")
                {
                    return d.x + offx
                }
            })
            .y(function (d) {
                return d.y + offy + ((rectSize + padding) / 2)
            })
            .curve(d3.curveLinear);

        let sum = 0;
        // if (direction === "left") {
        for (let i = 0; i < matrix[0].length; i++) {

            if (direction === "left")
                sum += getCurve(rects2line(rects.data(), i, (rectSize + padding / 2)))

            let lune = rects2line(rects.data(), i, (rectSize + padding / 2))

            lune.unshift({x: (rectSize + padding) * (i - 1), y: -12, width: 3});


            svg.append("path")
                .data([lune])
                // .data([rects2line(rects.data(), i, (rectSize + padding / 2))])
                .attr("d", line)
                .attr('stroke-width', 1)
                .attr('stroke', '#5b5b5b')
                .attr('fill', 'none')
                .attr("col", i)
                .attr("class", "vlines")
                .attr('opacity', 0)
                .transition()
                .duration(2900)
                .attr('opacity', lineBool[1])


        }
        // }
        // if (direction === "top") {

        for (let i = 0; i < matrix.length; i++) {

            let lune = rects.data().filter(d => d.line === i)


            if (direction === "top")
                sum += getCurve(lune)


            lune.unshift({x: -12, y: (padding + (rectSize + padding) * (i - 1) + rectSize), width: 3});


            svg.append("path")
                .data([lune])
                // .data([rects2line(rects.data(), i, (rectSize + padding / 2))])
                .attr("d", line)
                .attr("class", "hlines")
                .attr('stroke-width', 1)
                .attr('stroke', '#5b5b5b')
                .attr('fill', 'none')
                .attr("line", i)
                .attr('opacity', 0)
                .transition()
                .duration(2900)
                .attr('opacity', lineBool[0])

        }
        // }

        if (!inFront)
            d3.selectAll("path").moveToBack();
        applyStats(rects2line(rects.data(), matrix[0].length - 1, (rectSize + padding / 2)), rectSize, padding, matrix[0].length, sum / matrix[0].length, sparseacc / (matrix.length * matrix[0].length), matrix.length, matrix[0].length)

    }, 3500);
}