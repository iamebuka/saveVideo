const mongoose = require('mongoose');
const schema =  mongoose.Schema;

const dataSchema = new schema({
    media: [Object],
    text: String,
    original_tweetUrl: String,
    original_tweetID: String,
    generated_date: Date,
    user_id: { type: mongoose.Schema.ObjectId, required: true},
})

dataSchema.index({ "generated_date": 1, "user_id": 1 }, {  expires: 60 * 60 * 24 });

let datamodel = mongoose.model("tbvideo", dataSchema)

module.exports = datamodel