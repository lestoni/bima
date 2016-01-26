'use strict';
// Customer model Definiton.

/**
 * Load Module Dependencies.
 */
const mongoose  = require('mongoose');
const moment    = require('moment');
const paginator = require('mongoose-paginate');

const EPOCH = '1970-01-01T00:00:00Z';

var Schema = mongoose.Schema;

// New Customer Schema model
var CustomerSchema = new Schema({
  address: {
    street:         { type: String, default: 'Street name' },
    locality_name:  { type: String, default: 'Locality Name' },
    country:        { type: String, default: 'Country Name' },
    city:           { type: String, default: 'City Name' }
  },
  email:      { type: String, default: 'User@email.com' },
  person_details: {
    first_name:   { type: String, default: 'First Name' },
    last_name:    { type: String, default: 'Last Name' },
    gender:       { type: String, default: 'Gender' },
    date_of_birth: { type: Date, default: EPOCH }
  },
  organisation_details: {
    name:             { type: String, default: 'Organization Name' },
    business_nature:  { type: String, default: 'Business Nature' },
    employee_count:   { type: Number, default: 0 }
  },
  user:           { type: Schema.Types.ObjectId, ref: 'User' },
  type:           { type: String },
  date_created:   { type: Date },
  last_modified:  { type: Date }
});

/**
 * Customer Attributes to expose
 */
CustomerSchema.statics.attributes = {
  address: 1,
  email: 1,
  person_details: 1,
  organisation_details: 1,
  type: 1,
  date_created:   1,
  last_modified: 1
};

// Add middleware to support pagination
CustomerSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 */
CustomerSchema.pre('save', function preSaveMiddleware(next) {
  let token = this;

  // set date modifications
  let now = moment().toISOString();

  token.date_created = now;
  token.last_modified = now;

  next();

});


// Expose Customer model
module.exports = mongoose.model('Customer', CustomerSchema);
