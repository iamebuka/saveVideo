const user = require('../model/user');
const data = require('../model/data');

function createUserIfNotExist(screen_name) {
  return new Promise((resolve, reject) => {
    let username = screen_name.toLowerCase();
    user
      .findOne({ screen_name: username })
      .lean()
      .exec()
      .then(users => {
        if (users) resolve(users);
        if (users == null) {
          let u = new user({
            screen_name: username,
            created_date: new Date()
          });
          u.save().then(nuser => resolve(nuser));
        }
      })
      .catch(err => reject(err));
  });
}

function messageTemplate(screen_name) {
  let choice = getRandom(6);
  switch (choice) {
    case 1:
      return '@' + String(screen_name).trim() + ' 🔥🔥 The download you requested is ready at http://www.savetwittervideo.me/downloads/' + String(screen_name) ;
    break;
    case 2:
    return '@' + String(screen_name).trim() + ' Ding! Dong!! 🔔🔔 go to http://www.savetwittervideo.me/downloads/' + String(screen_name) + ' to download your video. I might not always respond, Please do check this link when you request for a new video';
    break;
    case 3:
    return '@' + String(screen_name).trim() + ' Here is the link you asked for http://www.savetwittervideo.me/downloads/' + String(screen_name) + ' 😎😎. Remember to bookmark this link for future reference.';
    break;
    case 4:
      return '@' + String(screen_name).trim() + ' Download ready here http://www.savetwittervideo.me/downloads/' + String(screen_name) + ' Bookmark. Share. Follow. 👏👏';
    break;
    case 5:
      return '@' + String(screen_name).trim() + ' Remember to Bookmark. Follow. Download is ready at http://www.savetwittervideo.me/downloads/' + String(screen_name);
    break;
    default:
      return '@' + String(screen_name).trim() + ' Hey your request is ready at http://www.savetwittervideo.me/downloads/' + String(screen_name) + ' I might not respond always, So Always check this link when you request for a new video';
  }
}

function getRandom(max) {
  return Math.floor(Math.random() * max) + 1;
}
module.exports = { createUserIfNotExist, messageTemplate };
