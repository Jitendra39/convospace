const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  uid: { type: String, required: true, uniquie: true },
  name: { type: String, required: true },
  photoURL: { type: String}
});

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  admin: {type: String, required: true},
  members: [memberSchema]
});
 
module.exports = mongoose.model('Groups', groupSchema);
