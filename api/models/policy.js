'use strict';
// Policy model Definiton.

/**
 * Load Module Dependencies.
 *
 * Policy status levels: active, dormant, cancelled
 */
const mongoose  = require('mongoose');
const moment    = require('moment');
const paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

// New Policy Schema model
var PolicySchema = new Schema({
  customer:       { type: Schema.Types.ObjectId, ref: 'Customer' },
  provider:       { type: Schema.Types.ObjectId, ref: 'Provider' },
  product:        { type: Schema.Types.ObjectId, ref: 'Product' },
  policy_number:  { type: String },
  status:         { type: String, default: 'dormant' },
  premium_amount:   { type: Number },
  mode_of_payment:  [{ type: String }],
  subscription_start_date:  { type: Date },
  renewal_date:             { type: Date },
  date_created:   { type: Date },
  last_modified:  { type: Date }
});

/**
 * Policy Attributes to expose
 */
PolicySchema.statics.attributes = {
  customer: 1,
  provider: 1,
  product: 1,
  policy_number: 1,
  status: 1,
  premium_amount: 1,
  duration: 1,
  subscription_start_date: 1,
  renewal_date: 1,
  date_created:   1,
  last_modified: 1
};

// Add middleware to support pagination
PolicySchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 */
PolicySchema.pre('save', function preSaveMiddleware(next) {
  let token = this;

  // set date modifications
  let now = moment().toISOString();

  token.date_created = now;
  token.last_modified = now;

  next();

});


// Expose Policy model
module.exports = mongoose.model('Policy', PolicySchema);
