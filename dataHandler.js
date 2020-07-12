async function getData(url) {
    data = await d3.json(url).then(d => {
        return d
    });

}

async function getDataCsv(url) {
    data = await d3.csv(url).then(d => {
        return d
    });
}
