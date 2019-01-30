const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    login: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    firstname: {
      type: String
    },
    lastname: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', schema);
