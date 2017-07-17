var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var karateClassSchema = new Schema({
  name: String,
  description: String
});

var KarateClass = mongoose.model('KarateClass', karateClassSchema);

// make this available to our users in our Node applications
module.exports = KarateClass;