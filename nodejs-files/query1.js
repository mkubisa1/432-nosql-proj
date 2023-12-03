const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('local');
    const emails = database.collection('cleaned-data');

    const neg = {
        $or: [
            {"date": {$regex: "Feb.2000"}},
            {"date": {$regex: "Mar.2000"}},
            {"date": {$regex: "Apr.2000"}},
            {"date": {$regex: "May.2000"}},
            {"date": {$regex: "Jun.2000"}}
        ],
        $and: [
            {"body": {$regex: "negative|frustrated|worried|awful|unsatisfied|disappointment|dissatisfaction"}},
            {"to": {$regex: "@enron.com"}}
        ]
    };
    const negCount = await emails.countDocuments(neg);
    console.log(negCount + " negative sentiment");

    const pos = {
      $or: [
        {"date": {$regex: "Feb.2000"}},
        {"date": {$regex: "Mar.2000"}},
        {"date": {$regex: "Apr.2000"}},
        {"date": {$regex: "May.2000"}},
        {"date": {$regex: "Jun.2000"}}
      ],
      $and: [
        {"body": {$regex: "positive|happy|awesome|nice|glad|satisfied|pleased|success"}},
        {"to": {$regex: "@enron.com"} }
      ]
    };
  const posCount = await emails.countDocuments(pos);
  console.log(posCount + " positive sentiment");

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);