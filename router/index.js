let express = require("express");
let axios = require("axios");
const twitter = require("twit");
const dbuser = require("../model/user");
const dbdata = require("../model/data");
let router = express.Router();
var ObjectId = require("mongoose").Types.ObjectId;
require("dotenv").config();

const twitterClient = new twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret,
});

router.get("/", function (req, res) {
  res.render("index");
});

router.post("/downloads", function (req, res, next) {
  let q = req.body.screen_name;
  res.redirect(`/downloads/${q}`);
});

router.get("/downloads/:user", function (req, res, next) {
  let screen_name = req.params.user.toLowerCase();
  dbuser
    .findOne({ screen_name })
    .lean()
    .exec()
    .then((user) => {
      if (!user) {
        res.render("error", { message: "page doesnt exist" });
      } else {
        dbdata
          .find({ user_id: ObjectId(user._id) })
          .sort({ generated_date: -1 })
          .limit(6)
          .then((results) => {
            /** @description return only results containing media */
            results = results.filter((result) => result.media);
            console.log("results", results);
            res.render("download", { screen_name, results });
          })
          .catch((err) => next(""));
      }
    })
    .catch((err) => next(""));
});

router.get("/downloads", function (req, res, next) {
  let URL = req.query.URL;
  if(!URL) res.redirect("/");

  let numberMatches = URL.match(/(\d+)/);
  if (numberMatches && numberMatches.length && URL.indexOf("https://twitter.com") > -1) {
    
    //retrieve tweet id && return tweet parent
    let tweetId = numberMatches[0];
    twitterClient.get("statuses/show", { id: tweetId, include_entities: true, tweet_mode: "extended" },
        function (err, tweet) {
        if (err) next(new Error("Unknown Server Error Occured"));
        if (tweet.extended_entities) {
          // if tweet contains media
          
          const media = tweet.extended_entities.media
            .filter((media) => media.type == "video")
            .map((media) => media.video_info.variants)
            .reduce((accum, current) => accum.concat(current), [])
            .filter((media) => media.content_type == "video/mp4" );
          
          if (media && media.length) {
             let URL = media[media.length - 1].url;
             res.set("Content-Disposition", "attachment;filename=video.mp4");
             downloader(URL).then(resp => {resp.data.pipe(res)})
          }
        } else {
          next(new Error("Invalid Twitter URL")); // if host is same but no tweet with no tweet containing video
        }
      }
    );
  } else {
    next(new Error("Invalid Twitter URL")); // if link isnt twitter link
  }
});

async function downloader(path) {
  let response = await axios({
    method: "get",
    url: path,
    responseType: "stream",
  });
 
  return response;
}

module.exports = router;
