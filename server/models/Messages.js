const mongoose = require("mongoose");

const messageSchame = mongoose.Schema({
  conversationId: {
    type: String,
  },
  senderId: {
    type: String,
  },
  message: {
    type: String,
  }
});

const Messages = mongoose.model("Messages", messageSchame);

module.exports = Messages;
