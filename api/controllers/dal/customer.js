'use strict';
// Access Layer for Customer Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-customer');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Customer    = require('../../models/customer');
const User        = require('../../models/user');
const mongoUpdate = require('../../lib/mongo-update');

const returnFields = Customer.attributes;
var population = [{
  path: 'user',
  select: User.attributes
}];

/**
 * create a new customer.
 *
 * @desc  creates a new customer and saves them
 *        in the database
 *
 * @param {Object}  customerData  Data for the customer to create
 */
exports.create = function create(customerData) {
  debug('creating a new customer');

  let searchQuery = {
    user: customerData.user
  };

  return co(function* () {
    let isPresent = yield Customer.findOne(searchQuery).exec();

    if(isPresent) {
      let err = new Error('Customer Already Exists');
      err.type = 'CUSTOMER_CREATION_ERROR';

      return yield Promise.reject(err);
    }

    let newCustomer = new Customer(customerData);
    let customer = yield newCustomer.save();

    return yield exports.get({ _id: customer._id});

  }).then((customer) => {
    return Promise.resolve(customer);
  }).catch((err) => {
    return Promise.reject(err);
  });

};

/**
 * delete a customer
 *
 * @desc  delete data of the customer with the given
 *        id
 *
 * @param {Object}  query   Query Object
 */
exports.delete = function deleteItem(query) {
  debug(`deleting customer: ${query}`);

  return co(function* () {
    let customer = yield exports.get(query);
    let _empty = {};

    if(!customer) {
      return _empty;
    } else {
      yield customer.remove();

      return customer;
    }
  }).then((customer) => {
    return Promise.resolve(customer);
  }, (err) => {
    return Promise.reject(err);
  });
};

/**
 * update a customer
 *
 * @desc  update data of the customer with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 */
exports.update = function update(query, updates) {
  debug(`updating customer: ${query}`);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  let promise = Customer
      .findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a customer.
 *
 * @desc get a customer with the given id from db
 *
 * @param {Object} query Query Object
 */
exports.get = function get(query) {
  debug(`getting customer ${query}`);

  let promise = Customer
      .findOne(query, returnFields)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a collection of customers
 *
 * @desc get a collection of customers from db
 *
 * @param {Object} query Query Object
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of customers');

  return new Promise((resolve, reject) => {
    resolve(
       Customer
       .find(query, returnFields)
       .populate(population)
       .stream());
  });

};

/**
 * get a collection of customers using pagination
 *
 * @desc get a collection of customers from db
 *
 * @param {Object} query Query Object
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of customers');

  let opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };

  return new Promise((resolve, reject) => {
    Customer.paginate(query, opts, function (err, docs) {
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
