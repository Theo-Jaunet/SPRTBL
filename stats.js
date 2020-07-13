function getCurve(points) {

    let acc = 0;
    let avgx = Math.abs(points[0].x + points[points.length - 1].x) / 2


    for (let i = 0; i < points.length; i++) {
        acc += Math.abs(points[i].x - avgx)
    }
    return Math.sqrt(acc / points.length)

}


function getAreaH(pend, height, padding, ref) {

    // console.log(pend);
    let acc = 0;
    for (let i = 0; i < pend.length; i++) {
        if (!isOdd(i)) {
            acc += ((pend[i].x + pend[i].width) * (height + padding))
        }
    }

    // console.log(acc);
    // console.log(acc / ((ref * (height + padding)) * (pend.length * (height + padding))))
    // console.log((ref * (height + padding)) * (pend.length * (height + padding)))
    return acc / ((ref * (height + padding)) * (pend.length * (height + padding)))
    // return acc
}


function isOdd(n) {
    return Math.abs(n % 2) === 1;
}


function applyStats(pend, height, padding, ref, avg, sparce, rows, cols) {


    $("#comp").html("Compression " + (Math.round(getAreaH(pend, height, padding, ref) * 100)) + "%");
    $("#dev").html("Deviation " + Math.round(avg * 100) / 100);
    $("#sparse").html("Sparse " + (Math.round(sparce * 100)) + "\\%")
    $("#mess").html("(" + rows + " rows, " + cols + " cols, " + (Math.round(sparce * 100)) + "\\%" + " sparse, " + (Math.round(getAreaH(pend, height, padding, ref) * 100)) + "\\% compr., " + (Math.round(avg * 100) / 100) + " dev.)")
}