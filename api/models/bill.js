'use strict';
// Bill model Definiton.

/**
 * Load Module Dependencies.
 */
const mongoose  = require('mongoose');
const moment    = require('moment');
const paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

// New Bill Schema model
var BillSchema = new Schema({
  due_date:       { type: Date },
  amount:         { type: Number, default: 0.0 },
  policy_number:  { type: String },
  customer:       { type: Schema.Types.ObjectId, ref: 'Customer' },
  status:         { type: String, default: 'overdue' },
  date_created:   { type: Date },
  last_modified:  { type: Date }
});

/**
 * Bill Attributes to expose
 */
BillSchema.statics.attributes = {
  due_date: 1,
  amount: 1,
  policy_number: 1,
  customer: 1,
  status: 1,
  date_created:   1,
  last_modified: 1
};

// Add middleware to support pagination
BillSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 */
BillSchema.pre('save', function preSaveMiddleware(next) {
  let model = this;

  // set date modifications
  let now = moment().toISOString();

  model.date_created = now;
  model.last_modified = now;
  model.due_date = model.due_date || now;

  next();

});


// Expose Bill model
module.exports = mongoose.model('Bill', BillSchema);
