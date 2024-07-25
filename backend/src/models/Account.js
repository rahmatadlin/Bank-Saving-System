const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  packet: {
    type: String,
    required: true,
    trim: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  depositoType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DepositoType'
  }
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);