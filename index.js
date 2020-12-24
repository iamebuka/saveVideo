const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const twitter = require("twit");
const redis = require("redis");
const mongoose = require("mongoose");
const https = require("https");
const indexRouter = require("./router/index");
const helper = require("./helper/index");
const cronJob = require("cron").CronJob;
require("dotenv").config();
const app = express();
const data = require("./model/data");

mongoose.connect(process.env.connection_uri, { useNewUrlParser: true });

const twitterClient = new twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret,
});

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname + "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", indexRouter);

function handleStream(event) {
  //only return value for replies to tweet where original tweet isnt bot that includes save as tweet
  let tweet = event.text;
  let tweetID = event.id_str;
  let tweetOwner = event.user.screen_name;
  let parentTweet = event.in_reply_to_status_id_str;
  let parentTweetOwner = event.in_reply_to_screen_name;

  if (parentTweet && parentTweetOwner !== "save_video") {
    //retrieve tweet id && return tweet parent
    twitterClient.get(
      "statuses/show",
      { id: parentTweet, include_entities: true, tweet_mode: "extended" },
      function (err, tweet) {
        if (err) console.log("stateus/show error", err);
        let { full_text, extended_entities } = tweet;

        if (extended_entities) {
          // if tweet contains media
          const media = extended_entities.media
            .filter((media) => media.type == "video")
            .map((media) => media.video_info.variants)
            .reduce((accum, current) => accum.concat(current), [])
            .filter((media) => media.content_type == "video/mp4" || media.content_type == "image/gif");

          if (media && media.length) {
            helper.createUserIfNotExist(tweetOwner).then(function (user) {
              /* create user and save record, if successful reply user*/
              data.create(
                {
                  media,
                  text: full_text,
                  original_tweetUrl: "",
                  original_tweetID: tweet.id_str,
                  generated_date: new Date(),
                  user_id: user._id,
                },
                function (err) {
                  replyTweet(tweetOwner, tweetID);
                  console.log("meow");
                }
              );
            });
          }
        } //console.log('doesnt contain a video');
      }
    );
  }
}

function replyTweet(screen_name, tweetID, callback) {
  let status = helper.messageTemplate(screen_name);
  twitterClient.post(
    "statuses/update",
    { status: status, in_reply_to_status_id: tweetID },
    function (err, tweet) {
      if (err) console.log(err);
    }
  );
}

var stream = twitterClient.stream("statuses/filter", { track: "@save_video" });

stream.on("tweet", function (event) {
  handleStream(event);
});

stream.on("error", function (error) {
  console.log(error);
});

//start cronJob to reset counter value every 15Minutes
new cronJob(
  "0 0 * * *",
  function () {
    console.log("******* cron job *******")
    let now = new Date();
    now.setHours(now.getHours() - 168);
    data.deleteMany({ generated_date: { $lt: now } }, (err, res) => {
      if (err) {
        console.log("an error occured");
      } else {
        console.log(res.deletedCount, " items deleted");
      }
    });
  },
  null,
  true,
  "America/Los_Angeles"
);

app.use(function (err, req, res, next) {
  res.render("error", { message: err.message });
});

app.listen(process.env.PORT || 3001);
