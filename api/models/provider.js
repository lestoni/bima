'use strict';
// Provider model Definiton.

/**
 * Load Module Dependencies.
 */
const mongoose  = require('mongoose');
const moment    = require('moment');
const paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

// New Provider Schema model
var ProviderSchema = new Schema({
  company_name:   { type: String },
  address: {
    location: {
      lat:     { type: Schema.Types.Mixed, index: '2d', default: 0.0 },
      'long':  { type: Schema.Types.Mixed, index: '2d', default: 0.0 }
    },
    street:         { type: String, default: 'Street name' },
    locality_name:  { type: String, default: 'Locality Name' },
    country:        { type: String, default: 'Country Name' },
    city:           { type: String, default: 'City Name' }
  },
  email:      { type: String, default: 'provider@company.com' },
  products:       [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  user:           { type: Schema.Types.ObjectId, ref: 'User' },
  date_created:   { type: Date },
  last_modified:  { type: Date }
});

/**
 * Provider Attributes to expose
 */
ProviderSchema.statics.attributes = {
  company_name: 1,
  address: 1,
  email: 1,
  products: 1,
  user: 1,
  date_created:   1,
  last_modified: 1
};

// Add middleware to support pagination
ProviderSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 */
ProviderSchema.pre('save', function preSaveMiddleware(next) {
  let token = this;

  // set date modifications
  let now = moment().toISOString();

  token.date_created = now;
  token.last_modified = now;

  next();

});


// Expose Provider model
module.exports = mongoose.model('Provider', ProviderSchema);
