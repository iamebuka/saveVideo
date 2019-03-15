const user = require('../model/user');
const data = require('../model/data');


function createUserIfNotExist(screen_name){
    return new Promise((resolve, reject) => {
    let username = screen_name.toLowerCase()
    user.findOne({screen_name: username}).lean().exec().then(users => {
        if(users) resolve(users);
        if(users == null){
            let u = new user({
                screen_name: username,
                created_date: new Date()
            })
            u.save().then(nuser => resolve(nuser))
        }
    }).catch(err => reject(err))
  })}

function messageTemplate(screen_name, link){
    return "@" + String(screen_name).trim() + "Hey your request is always available at http://www.savetwittervideo.me/downloads/" + String(screen_name);
  }
module.exports = {createUserIfNotExist, messageTemplate}