from lxml import html
import requests
import json
import argparse
from collections import OrderedDict
from nanoid import generate
import csv
from datetime import datetime
from pymongo import MongoClient
from pymongo.collation import Collation


client = MongoClient("mongodb+srv://IsaacQuinton:MongoDB135@cluster0.muipr.mongodb.net/Stock_Data?retryWrites=true&w=majority")

db = client["Stock_Data"]

colla = Collation(
locale = "en_US",
strength = 2,
numericOrdering = True,
backwards = False
)

ticker = "GOOG"


tickers = []

with open("../stocks_held_edx.csv", "r") as f:
    reader = csv.reader(f)
    for i, row in enumerate(reader):
        if i>0:
            tickers.append(row[0])


def get_headers():
    return {
    #         "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    #         "accept-encoding": "gzip, deflate, br",
    #         "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,ml;q=0.7",
    #         "cache-control": "max-age=0",
    #         "dnt": "1",
    #         "sec-fetch-dest": "document",
    #         "sec-fetch-mode": "navigate",
    #         "sec-fetch-site": "none",
    #         "sec-fetch-user": "?1",
    #         "upgrade-insecure-requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36"}

def parse(ticker):
    url = "https://finance.yahoo.com/quote/%s/history?p=%s" % (ticker, ticker)
    response = requests.get(url,headers=get_headers(),timeout=5)
    # url, verify=False, headers=get_headers(), timeout=30)
    print("Parsing %s" % (url))
    parser = html.fromstring(response.text)
    summary_table = parser.xpath(
    '//*[@id="Col1-1-HistoricalDataTable-Proxy"]/section/div[2]/table/tbody/tr')
    summary_data = []
    # print(summary_table[:100])
    raw_table_date = []
    raw_table_open = []
    raw_table_high = []
    raw_table_low = []
    raw_table_close = []
    raw_table_adj_close = []
    raw_table_volume = []
    raw_table_id = []

    try:
        for table_data in summary_table:
            try:
                raw_table_date.append(str(datetime.strptime(table_data.xpath(".//td[1]//text()")[0], "%b %d, %Y").strftime("%m/%d/%Y")))
                raw_table_open.append(str(table_data.xpath(".//td[2]//text()")[0]))
                raw_table_high.append(str(table_data.xpath(".//td[3]//text()")[0]))
                raw_table_low.append(str(table_data.xpath(".//td[4]//text()")[0]))
                raw_table_close.append(str(table_data.xpath(".//td[5]//text()")[0]))
                raw_table_adj_close.append(str(table_data.xpath(".//td[6]//text()")[0]))
                raw_table_volume.append(str(table_data.xpath(".//td[7]//text()")[0]))
            except:
                continue

        rows = zip(raw_table_date, raw_table_open, raw_table_high, raw_table_low, raw_table_close, raw_table_volume)
        return rows
    except ValueError:
        print("Failed to parse json response")
        return {"error": "Failed to parse json response"}
    except:
        return {"error": "Unhandled Error"}


for i, ticker in enumerate(tickers):
    ticker = ticker.replace(".","-")
    try:
        col = db.create_collection(
            name=ticker,
            codec_options=None,
            read_preference=None,
            write_concern=None,
            read_concern=None,
            session=None,
            collation=colla
            )
    except:
        col = db[ticker]
        print(ticker)
        print(col.count_documents({}))
        if col.count_documents({})>0:
            continue
    data = parse(ticker)
    print("To output")

    for row in data:
        try:
            stock_data_point = {
                "Date": row[0],
                "Open": row[1],
                "High": row[2],
                "Low": row[3],
                "Close/Last": row[4],
                "Volume": row[5]
            }
            result = col.insert_one(stock_data_point)
        except:
            print(row)

        

    print("Created and added: {}".format(ticker))
    if (i>100):
        break

# with open("GOOG-summary.csv", "w",newline="") as fp:
#     write = csv.writer(fp)
#     write.writerow(["_id","Date","Open","High","Low","Close/Last","Volume"])
#     for row in data:
#         write.writerow(row)




