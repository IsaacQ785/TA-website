const { connectToDatabase } = require('../../lib/mongodb')
const ObjectId = require('mongodb').ObjectId

export default async function handler (req, res) {
  // switch the methods
  switch (req.method) {
    case 'GET': {
      return getTickers(req, res)
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

async function getTickers (req, res) {
  try {
    // connect to the database
    const { db } = await connectToDatabase()
    // fetch the tickers
    const tickers = await db.collection('Stocks_Stored').find().toArray()
    // return the posts
    return res.json({
      message: tickers,
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
