const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    groups: {type: String, ref:'Groups'},
    message:[
      {
       senderId: {
        type: String,
        ref: "Member",
       }, 
       text:{
         type: String,
         required: true,
       },
       dates: {
          type: Date,
          default: Date.now,
       },
       time:{
          type: String,
          default: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
       },
       photoURL:{
        type: String,
       }
      }
    ]
});

module.exports = mongoose.model('Message', messageSchema);
