let rects;
let graphLayout;

function draw(matrix, svg, lineBool, morphBool, direction) {

    svg.selectAll("*").remove();
    const padding = 4;
    const rectSize = (900 - (padding * matrix.length)) / matrix.length

    const max = getMax(matrix);
    let color = d3.scaleLinear().domain([0, max]).range(['#fffacd', '#cf582f']).interpolate(d3.interpolateHcl);
    let lanes = d3.range(matrix.length).map(d => []);

    const hscale = d3.scaleSqrt().domain([0, max]).range([2, rectSize]);

    // console.log(matrix);

    let tlinks = [];
    let trec = [];
    let sparseacc = 0;
    for (let i = 0; i < matrix.length; i++) {

        // let g = ;
        for (let j = 0; j < matrix[0].length; j++) {
            let wid

            if (matrix[i][j] === 0) {
                sparseacc++
            }

            if (!morphBool) {
                wid = (matrix[i][j] == 0 ? 2 : rectSize)
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
        .attr("width", rectSize)
        .attr("height", rectSize)
        .attr("col", d => d.col)
        .attr("line", d => d.line)
        .attr("fill", d => (d.val === 0 ? "#d3d3d3" : color(d.val)))
        // .call(force.drag)
        .attr("transform", d => "translate(" + (d.x - d.width) + "," + (d.y - d.width) + ")");


    graphLayout = makeForce(direction, trec, tlinks);


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
        console.log("lala");
    }, 1750);


    setTimeout(function () {
        graphLayout.stop();
        console.log("lala");
        rects.transition().duration(1850).attr("width", d => d.width)
            .attr("transform", function (d, i) {
                    return "translate(" + (d.x) + "," + d.y + ")";
                }
            )
        // .on("end", animLines);
        let line = d3.line()
            .x(function (d) {
                return d.x + (d.width / 2);
            })
            .y(function (d) {
                return d.y
            })
            .curve(d3.curveLinear);

        let sum = 0;
        for (let i = 0; i < matrix[0].length; i++) {

            sum += getCurve(rects2line(rects.data(), i, (rectSize + padding / 2)))

            if (lineBool) {
                let tpath = svg.append("path")
                    .data([rects2line(rects.data(), i, (rectSize + padding / 2))])
                    .attr("d", line)
                    .attr('stroke-width', 1)
                    .attr('stroke', '#5b5b5b')
                    .attr('fill', 'none')
                    .attr("col", i)
                    .attr('opacity', 0)
                    .transition()
                    .duration(2900)
                    .attr('opacity', 1)
            }

        }
        applyStats(rects2line(rects.data(), matrix[0].length - 1, (rectSize + padding / 2)), rectSize, padding, matrix[0].length, sum / matrix[0].length, sparseacc / (matrix.length * matrix[0].length))

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

                nodePos.x = nodePos.x + Math.abs(nodePos.x - (prev.x + prev.width)) + 3.5

            } else if ((prev.x + prev.width) - nodePos.x > 5) {
                // nodePos.x = nodePos.x -5
            }
        }

    });


    // rects.attr("transform", function (d, i) {
    //     return "translate(" + (d.x) + "," + d.y + ")";
    // });
}


function makeForce(direction, trec, tlinks) {
    let simulation = d3.forceSimulation(trec).alpha(0.38);
    simulation.stop();
    switch (direction) {
        case "left":
            simulation
                // .force("link", d3.forceLink(tlinks).id(d => d.id).strength(1).distance(0.5))
                .force('collision', d3.forceCollide().iterations(4).radius(function (d) {
                    // console.log(d.width);
                    return d.width / 2
                }).strength(0.2))
                .force("charge", d3.forceManyBody().distanceMin(d => 5).distanceMax(5).strength(-50))
                .force("x", d3.forceX(0).strength(0.2))
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


function drawTable(matrix, svg, lineBool, direction) {

    svg.selectAll("*").remove();
    const padding = 0.1;
    const rectSize = 15;

    // const max = getMax(matrix);
    // let color = d3.scaleLinear().domain([0, max]).range(['#fffacd', '#cf582f']).interpolate(d3.interpolateHcl);
    let lanes = d3.range(matrix.length).map(d => []);

    // const hscale = d3.scaleSqrt().domain([0, max]).range([2, rectSize]);

    // console.log(matrix);
    let sparseacc =0;
    let tlinks = [];
    let trec = [];
    for (let i = 0; i < matrix.length; i++) {

        // let g = ;
        for (let j = 0; j < matrix[0].length; j++) {
            let wid = 1;
            if (/^\d*\.?\d+$/.test(matrix[i][j])) {
                wid = 7.5 * matrix[i][j].length
            }else {
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
        .attr("y", 10)
        // .attr("width", rectSize)
        // .attr("height", rectSize)
        .attr("col", d => d.col)
        .attr("line", d => d.line)
        // .attr("fill", d => (d.val === 0 ? "#d3d3d3" : color(d.val)))
        // .call(force.drag)
        .text(d => d.val)
        .attr("transform", d => "translate(" + (d.x) + "," + (d.y) + ")");


    graphLayout = makeForce(direction, trec, tlinks);


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
        console.log("lala");
    }, 1750);


    setTimeout(function () {
        graphLayout.stop();
        console.log("lala");
        rects.transition().duration(1850).attr("width", d => d.width)
            .attr("transform", function (d, i) {
                    return "translate(" + (d.x) + "," + d.y + ")";
                }
            )
        // .on("end", animLines);
        let line = d3.line()
            .x(function (d) {
                return d.x + (d.width / 2);
            })
            .y(function (d) {
                return d.y
            })
            .curve(d3.curveLinear);

        let sum = 0;
        for (let i = 0; i < matrix[0].length; i++) {

            sum += getCurve(rects2line(rects.data(), i, (rectSize + padding / 2)))

            if (lineBool) {
                let tpath = svg.append("path")
                    .data([rects2line(rects.data(), i, (rectSize + padding / 2))])
                    .attr("d", line)
                    .attr('stroke-width', 1)
                    .attr('stroke', '#5b5b5b')
                    .attr('fill', 'none')
                    .attr("col", i)
                    .attr('opacity', 0)
                    .transition()
                    .duration(2900)
                    .attr('opacity', 1)
            }

        }
        applyStats(rects2line(rects.data(), matrix[0].length - 1, (rectSize + padding / 2)), rectSize, padding, matrix[0].length, sum / matrix[0].length, sparseacc / (matrix.length * matrix[0].length))

    }, 3500);
}
