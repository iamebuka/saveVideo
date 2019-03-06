const user = require('../model/user');
const data = require('../model/data');


function createUserIfNotExist(screen_name){
    return new Promise((resolve, reject) => {
    user.findOne({screen_name}).lean().exec().then(users => {
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
    return `ding! dong!! Hi @${screen_name} click ${link} to download.
   you can also visit http://www.savetwittervideo.me/${screen_name} to download recent videos
    `
  }
module.exports = {createUserIfNotExist, messageTemplate}