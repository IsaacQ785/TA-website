# from wsgiref.validate import validator
import os
import csv
from pymongo import MongoClient
from pymongo.collation import Collation

client = MongoClient(
    "mongodb+srv://IsaacQuinton:MongoDB135@cluster0.muipr.mongodb.net/full_data?retryWrites=true&w=majority")

db = client["full_data"]

colla = Collation(
    locale="en_US",
    strength=2,
    numericOrdering=True,
    backwards=False
)

tickers = []

with open("../stocks_held_edx.csv", "r") as f:
    reader = csv.reader(f)
    for i, row in enumerate(reader):
        if i > 0:
            tickers.append(row[0])

for i, ticker in enumerate(tickers):
    print(ticker)
    ticker = ticker.replace(".", "-")
    try:
        col = db.create_collection(
            ticker
        )
    except:
        col = db[ticker]
        print(ticker)
        print(col.count_documents({}))
        if col.count_documents({}) > 0:
            continue
    filepath = 'tickerCSVs/' + ticker + '.csv'
    with open(filepath, 'r') as file:
        for j, row in enumerate(file):
            if j > 0:
                try:
                    rows = row.replace("\n","").split(",")
                    stock_data_point = {
                        "Date": rows[0],
                        "Open": rows[1],
                        "High": rows[2],
                        "Low": rows[3],
                        "Close/Last": rows[4],
                        "Volume": rows[6]
                    }
                    # print(stock_data_point)
                    result = col.insert_one(stock_data_point)
                except:
                    print(row)
            if j>200:
                print("{} done".format(j))
                break
    print("Created and added: {}".format(ticker))
