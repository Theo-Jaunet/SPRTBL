from sklearn.cluster import KMeans
import csv

if __name__ == '__main__':

    with open("iris.csv", "r")  as f:
        csv_reader = csv.DictReader(f, delimiter=',')
        X = []
        for row in csv_reader:
            row = dict(row)

            x.append([row["SepalLength"],row["SepalWidth"]])

km = KMeans(n_clusters=3, n_jobs=4, random_state=21)

km.fit(X)
