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
