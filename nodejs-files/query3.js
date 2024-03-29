const { MongoClient } = require("mongodb");
const fs = require("fs");

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('local');
    const emails = database.collection('cleaned-data');

    const query = {
      $and: [
        {
          $or: [
            {"to": {$regex: "@enron.com"}},
            {"X-cc": {$regex: "@enron.com"}},
            {"X-bcc": {$regex: "@enron.com"}}
          ]
        },
        {
          $or: [
            {"subject": {"$regex": "resign|termination|resignation|quit|leave|notice|departure"}},
            {"message": {"$regex": "resign|termination|resignation|quit|leave|notice|departure"}}
          ]
        }
      ]
    };

    const projection = { date: 1 };
    const sort = { date: 1 };

    const hits = await emails.find(query).project(projection).sort(sort).toArray();

    // Write the results to a JSON file
    const outputFile = 'query3-hits.json';
    fs.writeFileSync(outputFile, JSON.stringify(hits, null, 2));
    console.log(`Results exported to ${outputFile}`);

    // Array of target phrases
    const targetPhrases = ["Dec 2000", "Jan 2001", "Feb 2001"];

    // Search for and count instances of each target phrase
    targetPhrases.forEach(targetPhrase => {
      const count = hits.reduce((acc, email) => {
        if (email.date.includes(targetPhrase)) {
          return acc + 1;
        }
        return acc;
      }, 0);

      console.log(`Number of instances of "${targetPhrase}": ${count}`);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
