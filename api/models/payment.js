'use strict';
// Payment model Definiton.

/**
 * Load Module Dependencies.
 *
 * Status: 'completed, failed or cancelled
 */
const mongoose  = require('mongoose');
const moment    = require('moment');
const paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

// New Payment Schema model
var PaymentSchema = new Schema({
  amount:         { type: Number },
  payment_mode:   { type: String },
  status:         { type: String },
  bill:           { type: Schema.Types.ObjectId, ref: 'Bill' },
  date_created:   { type: Date },
  last_modified:  { type: Date }
});

/**
 * Payment Attributes to expose
 */
PaymentSchema.statics.attributes = {
  amount: 1,
  payment_mode: 1,
  status: 1,
  bill: 1,
  date_created:   1,
  last_modified: 1
};

// Add middleware to support pagination
PaymentSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 */
PaymentSchema.pre('save', function preSaveMiddleware(next) {
  let token = this;

  // set date modifications
  let now = moment().toISOString();

  token.date_created = now;
  token.last_modified = now;

  next();

});


// Expose Payment model
module.exports = mongoose.model('Payment', PaymentSchema);
