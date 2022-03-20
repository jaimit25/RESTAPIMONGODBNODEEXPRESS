https://flaviocopes.com/rest-api-express-mongodb/
//IMPORTANT PACKAGES
var express = require("express");
var app = express(); //convert express to app
app.use(express.json()); //for conversion

var fs = require("fs"); //file system module
const http = require("http");
const Joi = require("joi"); //for input validation

//DATABASE
const mongoose = require("mongoose");
const mongo = require("mongodb").MongoClient;
let db, trips, expenses;
//db - is the Database
//trips - is the collection
//expenses - is the collection

const url = "mongodb://localhost:27017";

//Default response
app.get("/", (req, res) => {
  res.send("hello world");
});


//GET AND POST REQUEST HANDLING
app.post("/trip", (req, res) => {
  const name = req.body.name;
  trips.insertOne({ name: name }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    console.log(result);
    res.status(200).json({ ok: true });
  });
});

app.get("/trips", (req, res) => {
  trips.find().toArray((err, items) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ trips: items });
  });
});

app.post("/expense", (req, res) => {
  expenses.insertOne(
    {
      trip: req.body.trip,
      date: req.body.date,
      amount: req.body.amount,
      category: req.body.category,
      description: req.body.description,
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      res.status(200).json({ ok: true });
    }
  );
});

app.get("/expenses", (req, res) => {
    // expenses.find({ trip: req.body.trip }).toArray((err, items)  => {
    expenses.find().toArray((err, items)  => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ expenses: items });
  });
});



//CONNECTION AND SERVER RELATED STUFF
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Listening on port http://localhost:${port}`)
);

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err);
      return;
    }
    db = client.db("tripcost");
    trips = db.collection("trips");
    expenses = db.collection("expenses");
  }
);
