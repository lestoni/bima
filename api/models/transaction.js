'use strict';
// Transaction model Definiton.

/**
 * Load Module Dependencies.
 *
 * Status: "failed" or "successful"
 * Type: claim, renewal or quote
 */
const mongoose  = require('mongoose');
const moment    = require('moment');
const paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

// New Transaction Schema model
var TransactionSchema = new Schema({
  type:   { type: String },
  status: { type: String },
  date_created:   { type: Date },
  last_modified:  { type: Date }
});

/**
 * Transaction Attributes to expose
 */
TransactionSchema.statics.attributes = {
  type: 1,
  status: 1,
  date_created:   1,
  last_modified: 1
};

// Add middleware to support pagination
TransactionSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 */
TransactionSchema.pre('save', function preSaveMiddleware(next) {
  let token = this;

  // set date modifications
  let now = moment().toISOString();

  token.date_created = now;
  token.last_modified = now;

  next();

});


// Expose Transaction model
module.exports = mongoose.model('Transaction', TransactionSchema);
