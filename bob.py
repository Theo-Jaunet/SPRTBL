import ujson
# import json
from sklearn.cluster import MeanShift
import numpy as np
import csv

if __name__ == '__main__':

    with open("my_data0.csv", "r") as f:
        csv_reader = csv.DictReader(f, delimiter=',')
        x = []

        for row in csv_reader:
            row = dict(row)

            print(row)
            x.append(np.array([row["x"], row["y"]], np.float32))

    clustering1 = MeanShift(bandwidth=60).fit(x)
    total = {}
    res = []
    i = 0
    for c in clustering1.labels_:
        res.append({"data": list(map(str, list(x[i]))), "clust": str(c), "id": str(i)})

        i += 1
    total["feats"] = res
    res = []
    with open("my_data1.csv", "r") as f:
        csv_reader2 = csv.DictReader(f, delimiter=',')
        x2 = []

        for row2 in csv_reader2:
            row2 = dict(row2)
            x2.append(np.array([row2["x"], row2["y"]], np.float32))

    clustering2 = MeanShift(bandwidth=60).fit(x2)
    i = 0
    for c in clustering2.labels_:
        res.append({"data": list(map(str, list(x2[i]))), "clust": str(c), "id": str(i)})

        i += 1
    total["atts"] = res

    print(total)
    print(total.keys())
    with open('out.json', 'w') as f:
        ujson.dump(total, f, indent=4, sort_keys=True)
