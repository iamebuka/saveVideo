const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const adSchema = new Schema({
source: String,
created_date: { default: new Date(), type: Date}
})


const adsModel = mongoose.model("tbads", adSchema)



module.exports = adsModel