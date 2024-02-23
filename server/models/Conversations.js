const mongoose = require("mongoose");

const conversationSchame = mongoose.Schema({
  members: {
    type: Array,
    require: true,
  }
});

const Conversation = mongoose.model("Conversation", conversationSchame);

module.exports = Conversation;
