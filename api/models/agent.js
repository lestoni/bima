'use strict';
// Agent model Definiton.

/**
 * Load Module Dependencies.
 */
const mongoose  = require('mongoose');
const moment    = require('moment');
const paginator = require('mongoose-paginate');

var Schema = mongoose.Schema;

// New Agent Schema model
var AgentSchema = new Schema({
  name:           { type: String },
  address: {
    street:         { type: String, default: 'Street name' },
    locality_name:  { type: String, default: 'Locality Name' },
    country:        { type: String, default: 'Country Name' },
    city:           { type: String, default: 'City Name' },
    location: {
      lat:   { type: Schema.Types.Mixed, index: '2d', default: 0.0 },
      'long':  { type: Schema.Types.Mixed, index: '2d', default: 0.0 }
    }
  },
  email:      { type: String, default: 'agent@company.com' },
  provider:       { type: Schema.Types.ObjectId, ref: 'Provider'},
  user:           { type: Schema.Types.ObjectId, ref: 'User'},
  date_created:   { type: Date },
  last_modified:  { type: Date }
});

/**
 * Agent Attributes to expose
 */
AgentSchema.statics.attributes = {
  name: 1,
  address: 1,
  email: 1,
  provider: 1,
  user: 1,
  date_created:   1,
  last_modified: 1
};

// Add middleware to support pagination
AgentSchema.plugin(paginator);

/**
 * Pre save middleware.
 *
 * @desc  - Sets the date_created and last_modified
 *          attributes prior to save.
 */
AgentSchema.pre('save', function preSaveMiddleware(next) {
  let token = this;

  // set date modifications
  let now = moment().toISOString();

  token.date_created = now;
  token.last_modified = now;

  next();

});

// Expose Agent model
module.exports = mongoose.model('Agent', AgentSchema);
