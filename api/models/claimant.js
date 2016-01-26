'use strict';
// Claimant model Definiton.

/**
 * Load Module Dependencies.
 *
 * Claim Status levels: rejected, pending, issued
 */
const mongoose  = require('mongoose');
const moment    = require('moment');
const paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

// New Claimant Schema model
var ClaimantSchema = new Schema({
  claim:          { type: Schema.Types.ObjectId, ref: 'Claim' },
  customer:       { type: Schema.Types.ObjectId, ref: 'Customer' },
  provider:       { type: Schema.Types.ObjectId, ref: 'Provider' },
  claim_status:   { type: String, default: 'pending' },
  date_created:   { type: Date },
  last_modified:  { type: Date }
});

/**
 * Claimant Attributes to expose
 */
ClaimantSchema.statics.attributes = {
  claim: 1,
  customer: 1,
  provider: 1,
  claim_status: 1,
  date_created:   1,
  last_modified: 1
};


// Add middleware to support pagination
ClaimantSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 */
ClaimantSchema.pre('save', function preSaveMiddleware(next) {
  let model = this;

  // set date modifications
  let now = moment().toISOString();

  model.date_created = now;
  model.last_modified = now;

  next();

});

// Expose Claimant model
module.exports = mongoose.model('Claimant', ClaimantSchema);
