'use strict';
// Access Layer for Claimant Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-claimant');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Claimant    = require('../../models/claimant');
const Claim    = require('../../models/claim');
const Provider    = require('../../models/provider');
const Customer = require('../../models/customer');
const mongoUpdate = require('../../lib/mongo-update');

const returnFields = Claimant.attributes;
var population = [{
  path: 'customer',
  select: Customer.attributes
},{
  path: 'claim',
  select: Claim.attributes
}, {
  path: 'provider',
  select: Provider.attributes
}];

/**
 * create a new claimant.
 *
 * @desc  creates a new claimant and saves them
 *        in the database
 *
 * @param {Object}  claimantData  Data for the claimant to create
 */
exports.create = function create(claimantData) {
  debug('creating a new claimant');

  let searchQuery = {
    claim: claimantData.claim,
    customer: claimantData.customer
  };

  return co(function* () {
    let isPresent = yield Claimant.findOne(searchQuery).exec();

    if(isPresent) {
      let err = new Error('Claimant For the Specified Claim Already Exists');
      err.type = 'CLAIMANT_CREATION_ERROR';

      return yield Promise.reject(err);
    }

    let newClaimant = new Claimant(claimantData);
    let claimant = yield newClaimant.save();

    return yield exports.get({ _id: claimant._id});

  }).then((claimant) => {
    return Promise.resolve(claimant);
  }).catch((err) => {
    return Promise.reject(err);
  });

};

/**
 * delete a claimant
 *
 * @desc  delete data of the claimant with the given
 *        id
 *
 * @param {Object}  query   Query Object
 */
exports.delete = function deleteItem(query) {
  debug(`deleting claimant: ${query}`);

  return co(function* () {
    let claimant = yield exports.get(query);
    let _empty = {};

    if(!claimant) {
      return _empty;
    } else {
      yield claimant.remove();

      return claimant;
    }
  }).then((claimant) => {
    return Promise.resolve(claimant);
  }, (err) => {
    return Promise.reject(err);
  });
};

/**
 * update a claimant
 *
 * @desc  update data of the claimant with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 */
exports.update = function update(query, updates) {
  debug(`updating claimant: ${query}`);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  let promise = Claimant
      .findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a claimant.
 *
 * @desc get a claimant with the given id from db
 *
 * @param {Object} query Query Object
 */
exports.get = function get(query) {
  debug(`getting claimant ${query}`);

  let promise = Claimant
      .findOne(query, returnFields)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a collection of claimants
 *
 * @desc get a collection of claimants from db
 *
 * @param {Object} query Query Object
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of claimants');

  return new Promise((resolve, reject) => {
    resolve(
       Claimant
       .find(query, returnFields)
       .populate(population)
       .stream());
  });

};

/**
 * get a collection of claimants using pagination
 *
 * @desc get a collection of claimants from db
 *
 * @param {Object} query Query Object
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of claimants');

  let opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };

  return new Promise((resolve, reject) => {
    Claimant.paginate(query, opts, function (err, docs) {
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
