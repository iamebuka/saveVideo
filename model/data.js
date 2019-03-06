const mongoose = require('mongoose');
const schema =  mongoose.Schema;

const dataSchema = new schema({
    media: [Object],
    original_tweetUrl: String,
    original_tweetID: String,
    generated_date: Date,
    user_id: { type: mongoose.Schema.ObjectId, required: true},
})



let datamodel = mongoose.model("tbvideo", dataSchema)

module.exports = datamodel