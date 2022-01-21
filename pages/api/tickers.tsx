const { connectToDatabase } = require("../../lib/mongodb");
const ObjectId = require("mongodb").ObjectId;
import dynamic from "next/dynamic";

export default async function handler(req, res) {
  // switch the methods
  switch (req.method) {
    case "GET": {
      return getTickers(req, res);
    }

    // case "POST": {
    //   return addTickers(req, res);
    // }

    // case "PUT": {
    //   return updateTickers(req, res);
    // }

    // case "DELETE": {
    //   return deleteTickers(req, res);
    // }
  }
}

async function getTickers(req, res) {
  try {
    // connect to the database
    let { db } = await connectToDatabase();
    // fetch the tickers
    let stock_data = await db.collection("Stocks_Stored").find().toArray();
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
