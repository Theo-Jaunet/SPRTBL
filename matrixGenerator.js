function initM(n, k) {
    return d3.range(n).map(d => d3.range(k).map(d => 0))
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function blockDiag(n, k, max) {

    let matrix = initM(n, k);
    let test = false;
    let count = 0;
    let indx = 1;

    while (!test) {

        for (let i = 0; i < indx; i++) {
            for (let j = 0; j < indx; j++) {
                if (count + i < n && count + j < k) {
                    matrix[count + i][count + j] = getRandomInt(1, max)
                } else {
                    test = true;
                }
            }

        }
        count += indx;
        indx += 1
    }
    return matrix
}

/*
* Using d3.js data format of networks with:
* data.nodes
* data.links
* */
function network2matrix(data) {
    console.log(data);

    let matrix = d3.range(data.nodes.length).map(d => d3.range(data.nodes.length).map(d => 0))

    for (let i = 0; i < data.links.length; i++) {
        let point = data.links[i]
        matrix[point.source][point.target] = point.value;
        matrix[point.target][point.source] = point.value;
    }
    return matrix
}


function table2matrix(data, columns) {

    let matrix = d3.range(data.length).map(d => d3.range(columns.length).map(d => null))
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < columns.length; j++) {
            matrix[i][j] = data[i][columns[j]]

        }
    }

    console.log(matrix);
    return matrix
}