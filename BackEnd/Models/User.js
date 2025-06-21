const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//For Passport
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pic: {
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/drdczhvhz/image/upload/v1750516699/2c47d5dd5b532f83bb55c4cd6f5bd1ef_lihldi.jpg",
    },
    filename: {
      type: String,
      default: "Unknown",
    },
  },
});

//For Passport
userSchema.plugin(passportLocalMongoose);

//To make the collection
module.exports = mongoose.model("User", userSchema);
