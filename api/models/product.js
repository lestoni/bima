'use strict';
// Product model Definiton.

/**
 * Load Module Dependencies.
 */
const mongoose  = require('mongoose');
const moment    = require('moment');
const paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

// New Product Schema model
var ProductSchema = new Schema({
  name:           { type: String },
  description:    { type: String },
  premiums:       [{ type: String }],
  date_created:   { type: Date },
  last_modified:  { type: Date }
});

/**
 * Product Attributes to expose
 */
ProductSchema.statics.attributes = {
  name: 1,
  description: 1,
  premiums: 1,
  date_created:   1,
  last_modified: 1
};


// Add middleware to support pagination
ProductSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 */
ProductSchema.pre('save', function preSaveMiddleware(next) {
  let token = this;

  // set date modifications
  let now = moment().toISOString();

  token.date_created = now;
  token.last_modified = now;

  next();

});

// Expose Product model
module.exports = mongoose.model('Product', ProductSchema);
