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

    let bob = purge(rotateClockwise(mat, 1))
    let bob2 = reOrderMat(bob.slice().map(d => d))
    let bob3 = bob2[0].map((d, i) => bob2.map(d => d[i]));

    return bob3
}


function reOrderMatBoth(mat) {

    return reOrderMat(reOrderMatCol(mat).slice().map(d => d.slice()))
}


function purge(mat) {

    // mat = mat.slice().map(d => d.slice());
    // console.log(mat);
    return mat.filter(d => {
        return d[0] !== undefined
    })
}

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};


function colSort(arr) {


    for (let i = 0; i < arr[0].length; i++) {
        for (let j = 0; j < arr.length; j++) {

            arr[j]


        }
    }

}