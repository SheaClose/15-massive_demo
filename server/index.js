require("dotenv").config();
const express = require("express");
const app = express();
const port = 3001;
const { json } = require("body-parser");
const massive = require("massive");

app.use(json());

massive(process.env.CONNECTION_STRING).then(dbInstance => {
  console.log("dbInstance: ", dbInstance);
  app.set("db", dbInstance);
});

app.get("/api/food", (req, res) => {
  let db = req.app.get("db");
  if (req.query.rating) {
    db.findFoodByRating(req.query.rating).then(food => {
      return res.status(200).json(food);
    });
  }
  db.food.find().then(food => {
    return res.status(200).json(food);
  });
});

app.get("/api/food/:id", (req, res) => {
  let db = req.app.get("db");
  db.findOneFood(req.params.id).then(food => {
    return res.status(200).json(food);
  });
});

app.post("/api/food", (req, res) => {
  let { name, category, rating, cost } = req.body;
  let db = req.app.get("db");
  db.postFood([name, category, rating, cost]).then(food => {
    return res.status(200).json(food);
  });
});

app.put("/api/food/:id", (req, res) => {
  let db = req.app.get("db");
  db.updateFood({
    id: req.params.id,
    name: req.body.name
  }).then(food => {
    return res.status(200).json(food);
  });
});

app.listen(port, () => console.log(`Listening @ ${port}`));
