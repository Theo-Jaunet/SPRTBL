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


function reOrderMat(mat) {
    return mat.slice().sort((a, b) => {
        let vala = a.reduce((a, b) => a + b);
        let valb = b.reduce((a, b) => a + b);
        return ((vala) > (valb)) ? -1 : (((valb) > (vala)) ? 1 : 0)
    });
}


function reOrderMatCol(mat) {
    console.log(purge(rotateClockwise(mat, 0)));
    return rotateClockwise(reOrderMat(rotateClockwise(mat, 0)), 3)
}


function purge(mat) {


    return mat.filter( d=>{return  d[0] === undefined})
}