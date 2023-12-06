const express = require("express");
const cors = require("cors");
const fs = require("fs");

const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri, { useUnifiedTopology: true });

app.use(cors());

// QUERY 1
app.get("/queries/query1", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("local");
    const emails = database.collection("cleaned-data");

    console.log("in data");
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

    res.json({ negCount, posCount });
  } finally {
    await client.close();
  }
});

// QUERY 2
app.get("/queries/query2", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("local");
    const emails = database.collection("cleaned-data");

    console.log("in data");
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

    res.json({ negCount, posCount });
  } finally {
    await client.close();
  }
});

// QUERY 3
app.get("/queries/query3", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("local");
    const emails = database.collection("cleaned-data");

    console.log("in data");
    const query = {
      $and: [
        {
          $or: [
            { to: { $regex: "@enron.com" } },
            { "X-cc": { $regex: "@enron.com" } },
            { "X-bcc": { $regex: "@enron.com" } },
          ],
        },
        {
          $or: [
            { subject: { $regex: "resign|termination|resignation|quit|leave|notice|departure" } },
            { message: { $regex: "resign|termination|resignation|quit|leave|notice|departure" } },
          ],
        },
      ],
    };

    const projection = { date: 1 };
    const sort = { date: 1 };

    const hits = await emails
      .find(query)
      .project(projection)
      .sort(sort)
      .toArray();

    // Write the results to a JSON file
    const outputFile = "query3-hits.json";
    fs.writeFileSync(outputFile, JSON.stringify(hits, null, 2));
    console.log(`Results exported to ${outputFile}`);

    // Array of target phrases
    const targetPhrases = ["Dec 2000", "Jan 2001", "Feb 2001"];

    const targetPhraseCounts = [];

    // Search for and count instances of each target phrase
    targetPhrases.forEach((targetPhrase) => {
        const count = hits.reduce((acc, email) => {
            if (email.date.includes(targetPhrase)) {
                return acc + 1;
            }
            return acc;
        }, 0);

        console.log(`Number of instances of "${targetPhrase}": ${count}`);
        targetPhraseCounts.push({ targetPhrase, count });
    });

    res.json({ targetPhraseCounts });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});