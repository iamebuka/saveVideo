const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new Schema({
screen_name: String,
created_date: Date
})


const userModel = mongoose.model("tbusers", userSchema)



module.exports = userModel