const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  photoURL: { type: String, required: true },

  groups: [
    {
      groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Groups', unique: true },
    }
  ]
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
