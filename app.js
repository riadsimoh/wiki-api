const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engin", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))


// Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });


const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);
/////////////////////////////////////////////
// Targetting all articles
app.route("/articles")
  .get((req, res) => {

    Article.find({}, (err, result) => {

      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    })

  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);
    const newArtilce = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArtilce.save(err => {
      if (!err) {
        res.send("Successfully added");
      } else {
        res.send(err);
      }
    });
    res.send("Merci pour avoir ajouté cette article");
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Ok");
      } else {
        res.send(err);
      }
    })
  });


////////////////////////////////////////////////////////////////////////////////
// Targetting a specific article
app.route("/articles/:title")
  .get((req, res) => {
    Article.findOne({ title: req.params.title }, (err, result) => {

      if (result) {
        res.send(result);
      } else {
        res.send("NO article match");
      }
    })
  })
  .put((req, res) => {
    Article.update(
      { title: req.params.title },
      {
        title: req.body.title,
        content: req.body.content
      },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Update successfully");
        } else {
          res.send(err);
        }
      }
    )
  })
  .patch((req, res) => {
    Article.update(
      { title: req.params.title },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Updated successfully");
        } else {
          res.send(err);
        }
      }
    )
  })
  .delete((req, res) => {
    Article.deleteOne(
      { title: req.params.title },
      (err) => {
        if (!err) {
          res.send("Delete successfully")

        } else {
          res.send(err);
        }
      }

    )
  })


app.listen("3000", (req, res) => {
  console.log("Server is listening on port 3000");
})

