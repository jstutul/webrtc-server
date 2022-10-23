const Conversation = require("../models/conversation");
const chatUpdates = require("./updates/chat");
const directChatHistoryHandler = async (socket, data) => {
  console.log("message handler event working");
  try {
    const { userId } = socket.user;
    const { receiverUserId, content } = data;
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
      type: "DIRECT",
    });
    if (conversation) {
      chatUpdates.updateChatHistory(conversation._id.toString(), socket.id);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directChatHistoryHandler;
