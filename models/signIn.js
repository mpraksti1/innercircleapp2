var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var signInSchema = new Schema({
  name: String,
  userId: String,
  classId: String,
  dateLogged: { type: Date, default: Date.now() }
});

var SignIn = mongoose.model('SignIn', signInSchema);

// make this available to our users in our Node applications
module.exports = SignIn;
