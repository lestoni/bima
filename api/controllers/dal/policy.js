'use strict'; // Access Layer for Policy Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-policy');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Policy       = require('../../models/policy');
const Provider    = require('../../models/provider');
const Product    = require('../../models/product');
const Customer    = require('../../models/customer');
const mongoUpdate = require('../../lib/mongo-update');

const returnFields = Policy.attributes;
var population = [{
  path: 'provider',
  select: Provider.attributes
}, {
  path: 'product',
  select: Product.attributes
}, {
  path: 'customer',
  select: Customer.attributes
}];

/**
 * create a new policy.
 *
 * @desc  creates a new policy and saves them
 *        in the database
 *
 * @param {Object}  policyData  Data for the policy to create
 */
exports.create = function create(policyData) {
  debug('creating a new policy');

  let searchQuery = {
    customer: policyData.customer
  };

  return co(function* () {
    let isPresent = yield Policy.findOne(searchQuery).exec();

    if(isPresent) {
      let err = new Error('Policy Contract for the Customer Already Exists');
      err.type = 'POLICY_CREATION_ERROR';

      return yield Promise.reject(err);
    }

    let newPolicy = new Policy(policyData);
    let policy = yield newPolicy.save();

    return yield exports.get({ _id: policy._id});

  }).then((policy) => {
    return Promise.resolve(policy);
  }).catch((err) => {
    return Promise.reject(err);
  });

};

/**
 * delete a policy
 *
 * @desc  delete data of the policy with the given
 *        id
 *
 * @param {Object}  query   Query Object
 */
exports.delete = function deleteItem(query) {
  debug(`deleting policy: ${query}`);

  return co(function* () {
    let policy = yield exports.get(query);
    let _empty = {};

    if(!policy) {
      return _empty;
    } else {
      yield policy.remove();

      return policy;
    }
  }).then((policy) => {
    return Promise.resolve(policy);
  }, (err) => {
    return Promise.reject(err);
  });
};

/**
 * update a policy
 *
 * @desc  update data of the policy with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 */
exports.update = function update(query, updates) {
  debug(`updating policy: ${query}`);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  let promise = Policy
      .findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a policy.
 *
 * @desc get a policy with the given id from db
 *
 * @param {Object} query Query Object
 */
exports.get = function get(query) {
  debug(`getting policy ${query}`);

  let promise = Policy
      .findOne(query, returnFields)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a collection of policys
 *
 * @desc get a collection of policys from db
 *
 * @param {Object} query Query Object
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of policys');

  return new Promise((resolve, reject) => {
    resolve(
       Policy
       .find(query, returnFields)
       .populate(population)
       .stream());
  });

};

/**
 * get a collection of policys using pagination
 *
 * @desc get a collection of policys from db
 *
 * @param {Object} query Query Object
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of policys');

  let opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };

  return new Promise((resolve, reject) => {
    Policy.paginate(query, opts, function (err, docs) {
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
