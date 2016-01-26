'use strict';
// Access Layer for Claim Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-claim');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Claim    = require('../../models/claim');
const Claimant = require('../../models/claimant');
const mongoUpdate = require('../../lib/mongo-update');

const returnFields = Claim.attributes;
var population = [{
  path: 'claimant',
  select: Claimant.attributes
}];

/**
 * create a new claim.
 *
 * @desc  creates a new claim and saves them
 *        in the database
 *
 * @param {Object}  claimData  Data for the claim to create
 */
exports.create = function create(claimData) {
  debug('creating a new claim');

  let searchQuery = {};

  return co(function* () {

    let newClaim = new Claim(claimData);
    let claim = yield newClaim.save();

    return yield exports.get({ _id: claim._id});

  }).then((claim) => {
    return Promise.resolve(claim);
  }).catch((err) => {
    return Promise.reject(err);
  });

};

/**
 * delete a claim
 *
 * @desc  delete data of the claim with the given
 *        id
 *
 * @param {Object}  query   Query Object
 */
exports.delete = function deleteItem(query) {
  debug(`deleting claim: ${query}`);

  return co(function* () {
    let claim = yield exports.get(query);
    let _empty = {};

    if(!claim) {
      return _empty;
    } else {
      yield claim.remove();

      return claim;
    }
  }).then((claim) => {
    return Promise.resolve(claim);
  }, (err) => {
    return Promise.reject(err);
  });
};

/**
 * update a claim
 *
 * @desc  update data of the claim with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 */
exports.update = function update(query, updates) {
  debug(`updating claim: ${query}`);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  let promise = Claim
      .findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a claim.
 *
 * @desc get a claim with the given id from db
 *
 * @param {Object} query Query Object
 */
exports.get = function get(query) {
  debug(`getting claim ${query}`);

  let promise = Claim
      .findOne(query, returnFields)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a collection of claims
 *
 * @desc get a collection of claims from db
 *
 * @param {Object} query Query Object
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of claims');

  return new Promise((resolve, reject) => {
    resolve(
       Claim
       .find(query, returnFields)
       .populate(population)
       .stream());
  });

};

/**
 * get a collection of claims using pagination
 *
 * @desc get a collection of claims from db
 *
 * @param {Object} query Query Object
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of claims');

  let opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };

  return new Promise((resolve, reject) => {
    Claim.paginate(query, opts, function (err, docs) {
      if(err) {
        return reject(err);
      }

      let data = {
        total_pages: docs.pages,
        total_docs_count: docs.total,
        current_page: docs.page,
        docs: docs.docs
      };

      resolve(data);

    });
  });

};
