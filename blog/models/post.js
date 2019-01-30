const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* Post */
const schema = new Schema(
  {
    title: {
      type: String
    },
    body: {
      type: String
    },
    url: {
      type: String
    },
    commentCount: {
      type: Number,
      default: 0
    },
    uploads: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Upload'
      }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      required: true,
      default: 'published'
    }
  },
  {
    timestamps: true
  }
);

schema.statics = {
  incCommentCount(postId) {
    return this.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } }, { new: true });
  }
};

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Post', schema);
