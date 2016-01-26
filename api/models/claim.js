'use strict';
// Claim model Definiton.

/**
 * Load Module Dependencies.
 */
const mongoose  = require('mongoose');
const moment    = require('moment');
const paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

// New Claim Schema model
var ClaimSchema = new Schema({
  claimant:       { type: Schema.Types.ObjectId, ref: 'Claimant' },
  policy:         { type: Schema.Types.ObjectId, ref: 'Policy' },
  claim_date:     { type: Date },
  incident_description:   { type: String },
  incident_date:          { type: Date },
  place_of_occurence:     { type: String },
  additional_info:  { type: String },
  photo_evidence:   [{ type: String }],
  date_created:     { type: Date },
  last_modified:    { type: Date }
});

/**
 * Claim Attributes to expose
 */
ClaimSchema.statics.attributes = {
  claimant: 1,
  policy: 1,
  claim_date: 1,
  incident_description: 1,
  incident_date: 1,
  place_of_occurence: 1,
  additional_info: 1,
  photo_evidence: 1,
  date_created:   1,
  last_modified: 1
};

// Add middleware to support pagination
ClaimSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 */
ClaimSchema.pre('save', function preSaveMiddleware(next) {
  let token = this;

  // set date modifications
  let now = moment().toISOString();

  token.date_created = now;
  token.last_modified = now;

  next();

});


// Expose Claim model
module.exports = mongoose.model('Claim', ClaimSchema);
