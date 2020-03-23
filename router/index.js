let express = require("express");
const dbuser = require("../model/user");
const dbdata = require("../model/data");
let router = express.Router();
var ObjectId = require("mongoose").Types.ObjectId;

router
  .get("/", function (req, res) {
    res.render("index");
  })
  .post("/downloads", function (req, res, next) {
    let q = req.body.screen_name;
    res.redirect(`/downloads/${q}`);
  })
  .get("/downloads/:user", function (req, res, next) {
    let screen_name = req.params.user.toLowerCase();
    dbuser
      .findOne({ screen_name })
      .lean()
      .exec()
      .then(user => {
        if (!user) {
          res.render("error", { message: "page doesnt exist" });
        } else {
          dbdata
            .find({ user_id: ObjectId(user._id) }).sort({ 'generated_date': -1 }.limit(6))
            .then(results => {
              /** @description return only results containing media */
              results = results.filter(result => result.media)
              console.log("results", results)
              res.render("download", { screen_name, results });
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  });

module.exports = router;
