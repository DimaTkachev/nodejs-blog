const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  path: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Upload', schema);
