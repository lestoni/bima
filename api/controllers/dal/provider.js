'use strict';
// Access Layer for Provider Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-provider');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Provider    = require('../../models/provider');
const Product     = require('../../models/product');
const User        = require('../../models/user');
const mongoUpdate = require('../../lib/mongo-update');

const returnFields = Provider.attributes;
var population = [{
  path: 'products',
  select: Product.attributes
},{
  path: 'user',
  select: User.attributes
}];

/**
 * create a new provider.
 *
 * @desc  creates a new provider and saves them
 *        in the database
 *
 * @param {Object}  providerData  Data for the provider to create
 */
exports.create = function create(providerData) {
  debug('creating a new provider');

  let searchQuery = {
    user: providerData.user
  };

  return co(function* () {
    let isPresent = yield Provider.findOne(searchQuery).exec();

    if(isPresent) {
      let err = new Error('Provider Already Exists');
      err.type = 'PROVIDER_CREATION_ERROR';

      return yield Promise.reject(err);
    }

    let newProvider = new Provider(providerData);
    let provider = yield newProvider.save();

    return yield exports.get({ _id: provider._id});

  }).then((provider) => {
    return Promise.resolve(provider);
  }).catch((err) => {
    return Promise.reject(err);
  });

};

/**
 * delete a provider
 *
 * @desc  delete data of the provider with the given
 *        id
 *
 * @param {Object}  query   Query Object
 */
exports.delete = function deleteItem(query) {
  debug(`deleting provider: ${query}`);

  return co(function* () {
    let provider = yield exports.get(query);
    let _empty = {};

    if(!provider) {
      return _empty;
    } else {
      yield provider.remove();

      return provider;
    }
  }).then((provider) => {
    return Promise.resolve(provider);
  }, (err) => {
    return Promise.reject(err);
  });
};

/**
 * update a provider
 *
 * @desc  update data of the provider with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 */
exports.update = function update(query, updates) {
  debug(`updating provider: ${query}`);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  let promise = Provider
      .findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a provider.
 *
 * @desc get a provider with the given id from db
 *
 * @param {Object} query Query Object
 */
exports.get = function get(query) {
  debug(`getting provider ${query}`);

  let promise = Provider
      .findOne(query, returnFields)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a collection of providers
 *
 * @desc get a collection of providers from db
 *
 * @param {Object} query Query Object
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of providers');

  return new Promise((resolve, reject) => {
    resolve(
       Provider
       .find(query, returnFields)
       .populate(population)
       .stream());
  });

};

/**
 * get a collection of providers using pagination
 *
 * @desc get a collection of providers from db
 *
 * @param {Object} query Query Object
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of providers');

  let opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };

  return new Promise((resolve, reject) => {
    Provider.paginate(query, opts, function (err, docs) {
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
