const { connectToDatabase } = require('../../lib/mongodb')
const ObjectId = require('mongodb').ObjectId

export default async function handler (req, res) {
  // switch the methods
  switch (req.method) {
    case 'GET': {
      return getUser(req, res)
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

async function getUser (req, res) {
  try {
    // connect to the database
    const { db } = await connectToDatabase()
    // fetch the posts
    const user = await db
      .collection('users')
      .find({ username: req.body.username, password: req.body.password })
      .toArray()
    // return the posts
    return res.json({
      message: user,
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
