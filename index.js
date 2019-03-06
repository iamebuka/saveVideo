const express = require('express');
const session = require('express-session');

const twitter = require('twitter');
const redis = require('redis');
const mongoose = require('mongoose');

const indexRouter = require('./router/index');
const helper = require('./helper/index')
const cronJob = require('cron').CronJob
require('dotenv').config();
const app = express();
const data = require('./model/data');

mongoose.connect(`mongodb://${process.env.dbuser}:${process.env.dbpass}@ds159185.mlab.com:59185/dbsavevideo`,{ useNewUrlParser: true });

const twitterClient = new twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
});

app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/', indexRouter);

function handleStream(event){
  
  //only return value for replies to tweet where original tweet isnt bot that includes save as tweet 
  let tweet = event.text;
  let tweetID = event.id_str;
  let tweetOwner = event.user.screen_name.toLowerCase();
  let parentTweet = event.in_reply_to_status_id_str;
  let parentTweetOwner = event.in_reply_to_screen_name
 
  if ( parentTweet &&  parentTweetOwner !== 'save_video' && tweet.includes('save')) {

    //retrieve tweet id && return tweet parent
    twitterClient.get('statuses/show', { id: parentTweet }, function(err, tweet) {
        if (err) throw new Error(err);
        if (tweet.extended_entities) {
          console.log('contains video')
          console.log('screen_name', event.user.screen_name)
          //if tweet contains media
          let media = tweet.extended_entities.media
            .filter(media => media.type == 'video')
            .map(media => media.video_info.variants)
            .reduce((accum, current) => accum.concat(current), []);
          if (!media) {
           // console.log('only contains images');
            return;
          } //reply user with no video to download or do nothing

      helper.createUserIfNotExist(tweetOwner).then(function(user){
        console.log('user returned',user)

        data.create({
          
          media,
          original_tweetUrl: '',
          original_tweetID: tweet.id_str,
          generated_date: new Date(),
          user_id: user._id
        }, function(err){
          replyTweet(tweetOwner, media[0].url, tweetID)
          console.log('meow')
      
      })
      
      })   
      } //else //console.log('doesnt contain a video');
      });
  }
}


function replyTweet(screen_name, link, tweetID, callback){
  
  let status = helper.messageTemplate(screen_name,link)
  console.log('status', status, tweetID)
  twitterClient.post('statuses/update',{status, in_reply_to_status_id: tweetID }, function(err, tweet){
    if(err) throw err;
    
  })
}


//start cronJob to reset counter value every 15Minutes
new cronJob('0 */15 * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

//start cronJob to reset value every 15Minutes
new cronJob('0 */15 * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');

twitterClient.stream('statuses/filter', { track: '@save_video' }, function(stream) {
  
  stream.on('data', function(event) {
   handleStream(event)
  });

  stream.on('error', function(error) {
    throw error;
  });
});


app.listen(process.env.PORT || 3000);
