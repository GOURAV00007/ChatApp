require("dotenv").config();
const MongoStore = require("connect-mongo");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const session = require("express-session");
const userRoute = require("./routes/user.js");
const chatRoute = require("./routes/chats.js");
const messagesRoute = require("./routes/message.js");
const User = require("./Models/User.js");
const path = require("path");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://chatapp-frontend-nzh9.onrender.com",
    credentials: true,
  })
);

const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  crypto: {
    secret: "mysupersecret",
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("Error in Mongo Session Store", err);
});
const sessionOptions = {
  store,
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
  },
};

app.use(session(sessionOptions));

//for Passport login and register
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

//Routes
app.use("/", userRoute);
app.use("/chats", chatRoute);
app.use("/messages", messagesRoute);

const server = app.listen(8080, () => {
  console.log("App is Listening");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chatapp-frontend-nzh9.onrender.com",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("In setup");
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("Join chat");
  });

  socket.on("new message", (newMessageRecieved) => {
    console.log("In new message");
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      console.log(`Sending message to: ${user._id}`);
      io.to(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
