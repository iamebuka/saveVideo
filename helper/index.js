const user = require('../model/user');
const data = require('../model/data');

function isPreviouslyDownloaded(screen_name, tweetId) {
 data.findOne({ $and: [{ screen_name }, { tweetId }] });
   
  }


function createUserIfNotExist(screen_name){
    return new Promise((resolve, reject) => {
    user.findOne({screen_name}).lean().exec().then(users => {
        console.log(users)
        if(users) resolve(users);
        if(users == null){
            let u = new user({
                screen_name,
                created_date: new Date()
            })
            u.save().then(nuser => resolve(nuser))
        }
    }).catch(err => reject(err))
  })}

function messageTemplate(screen_name, link){
    return `ding! dong!! @${screen_name} visit ${link} to download `
  }
module.exports = {createUserIfNotExist, isPreviouslyDownloaded, messageTemplate}