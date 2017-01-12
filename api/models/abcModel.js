var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var abcSchema = new Schema({
    name: String,
    age: Number
},{collection:"abc"});

var abc = mongoose.model("abc",abcSchema);
module.exports = abc;