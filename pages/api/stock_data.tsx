const { connectToDatabase } = require('../../lib/mongodb');
const ObjectId = require('mongodb').ObjectId;
import dynamic from "next/dynamic";

export default async function handler(req, res) {
    // switch the methods
    switch (req.method) {
        case 'GET': {
            return getStockData(req, res);
        }

        // case 'POST': {
        //     return addStockData(req, res);
        // }

        // case 'PUT': {
        //     return updateStockData(req, res);
        // }

        // case 'DELETE': {
        //     return deleteStockData(req, res);
        // }
    }
}

async function getStockData(req,res) {
    // isolate ticker
    const ticker_start = req.url.indexOf("?");
    if (ticker_start==-1) {
        return res.json({
            message: "Search Failed, Please report failure and try again later",
            success: false,
        });
    }
    const ticker = req.url.slice(ticker_start+1);
    console.log(ticker);
    try {
        // connect to the database
        let { db } = await connectToDatabase();
        // fetch the posts
        let data_len = await db
            .collection(ticker)
            .find()
            .count();
        if (data_len===0) {
            return res.json({
                message: "Ticker not currently supported: " + ticker + ". Please try again",
                success: false,
            });
        }
        let stock_data = await db
            .collection(ticker)
            .find()
            .toArray();
        // return the posts
        return res.json({
            message: stock_data,
            success: true,
        });
    } catch (error) {
        // return the error
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}
