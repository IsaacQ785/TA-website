const { connectToDatabase } = require('../../lib/mongodb')
const ObjectId = require('mongodb').ObjectId

export default async function handler (req, res) {
  // switch the methods
  switch (req.method) {
    case 'GET': {
      return getStockData(req, res)
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

async function getStockData (req, res) {
  // isolate ticker
  const tickerStart = req.url.indexOf('?')
  if (tickerStart === -1) {
    return res.json({
      message: 'Search Failed, Please report failure and try again later',
      success: false
    })
  }
  const ticker = req.url.slice(tickerStart + 1)
  console.log(ticker)
  try {
    // connect to the database
    const { db } = await connectToDatabase()
    // fetch the posts
    const dataLen = await db
      .collection(ticker)
      .find()
      .count()
    if (dataLen === 0) {
      return res.json({
        message: 'Ticker not currently supported: ' + ticker + '. Please try again',
        success: false
      })
    }
    const stockData = await db
      .collection(ticker)
      .find()
      .toArray()
    stockData.sort(function (a: { Date: string }, b: { Date: string }) {
      return Date.parse(a.Date) - Date.parse(b.Date)
    }).reverse()
    // return the posts
    return res.json({
      message: stockData,
      success: true
    })
  } catch (error) {
    // return the error
    return res.json({
      message: new Error(error).message,
      success: false
    })
  }
}
