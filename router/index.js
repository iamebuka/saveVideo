let express = require("express");
const dbuser = require("../model/user");
const dbdata = require("../model/data");
let router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId
router
  .get("/", function(req, res) {
    res.render("index");
  })

  .get("/downloads/:user", function(req, res) {
    let screen_name = req.params.user.toLowerCase();
    dbuser
      .findOne({ screen_name })
      .lean()
      .exec()
      .then(user => {
        dbdata
          .find({ user_id: ObjectId(user._id) })
          .then(results => {
            console.log(results);
            res.render("download", { screen_name, results });
          }).catch((err)=> console.log("err"));
      }).catch((err)=> console.log("err"));
  });

module.exports = router;
