const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");
const Chat = require("../Models/Chat.js");
const Message = require("../Models/Message.js");
const { IsLoggedIn } = require("../middleware.js");

router.post("/sendmessages",  async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("NO Data found");
    // alert("No Data Found");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "_id name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (err) {
    console.log(err);
    // alert("There is error in sending messages");
    res.json({ message: "There is error in sending messages" });
  }
});

router.get("/:chatId",  async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(message);
  } catch (err) {
    console.log(err);
    // alert("There is some error");
    res.json({ message: "There is some error" });
  }
});
module.exports = router;
