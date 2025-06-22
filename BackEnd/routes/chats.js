const express = require("express");
const router = express.Router();
const User = require("../Models/User.js");
const Chat = require("../Models/Chat.js");
const { IsLoggedIn } = require("../middleware.js");

router.get("/search",  async (req, res) => {
  const search = req.query.search;
  try {
    let data = await User.find({
      username: { $regex: search, $options: "i" },
    }).find({ _id: { $ne: req.user._id } });
    res.json({ data: data, success: true });
  } catch (err) {
    console.log(err);
    // alert("Something is wrong in Search");
    res.json({ message: "There is something wrong with Search" });
  }
});

router.get("/accessChat",  async (req, res) => {
  let userId = req.query.userId;
  try {
    if (!userId) {
      // console.log("There is no user");
      // alert("There is no User of which you are accessing chats");
      res.json({
        message: "There is no User of which you are accessing chats",
      });
    }
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
    });
    if (isChat.length > 0) {
      res.json({ data: isChat });
    } else {
      let chat = new Chat({
        chatName: "Sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      chat.save();
      let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      }).populate("users", "-password");
      res.json({ data: isChat });
    }
  } catch (err) {
    console.log(err);
    // alert("There is problem in accessing Chat");
    res.json({ message: "There is no User of which you are accessing chats" });
  }
});

router.get("/fetechChats",  async (req, res) => {
  console.log("🚨 SESSION:", req.session);
  console.log("✅ Authenticated?", req.isAuthenticated?.(), req.user);
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
        });
        res.json({ data: result });
      });
  } catch (error) {
    console.log(error);
    // alert("There is error in fetching Chats");
    res.json({ message: "There is no User of which you are accessing chats" });
  }
});

router.post("/createGroupChat",  async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.json({ message: "Please Fill all the fields" });
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.json({ message: "More than two users required" });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("gropuAdmin", "-password");
    res.json(fullGroupChat);
  } catch (error) {
    console.log(error);
    // alert("There is error in creating group");
    res.json({ message: "There is error in creating group" });
  }
});
module.exports = router;
