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
        {"to": {$not: {$regex: "@enron.com"}}},
        {"X-cc": {$not: {$regex: "@enron.com"}}},
        {"X-bcc": {$not: {$regex: "@enron.com"}}}
      ],
      $and: [
        {"from": {$regex: "@enron.com"}},
        {"body": {$regex: "apology|difficulty|upset|angry|delay|mistake|inconvenience|negative|frustrated|worried|awful"}}
      ]
    };
    const negCount = await emails.countDocuments(neg);
    console.log(negCount + " negative sentiment");

    const pos = {
      $or: [
        {"to": {$not: {$regex: "@enron.com"}}},
        {"X-cc": {$not: {$regex: "@enron.com"}}},
        {"X-bcc": {$not: {$regex: "@enron.com"}}}
      ],
      $and: [
        {"from": {$regex: "@enron.com"}},
        {"body": {$regex: "positive|happy|excellent|thanks|pleased|appreciation|successful|efficient"}}
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