'use strict';
// Access Layer for Bill Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-bill');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Bill    = require('../../models/bill');
const Customer = require('../../models/customer');
const mongoUpdate = require('../../lib/mongo-update');

const returnFields = Bill.attributes;
var population = [{
  path: 'customer',
  select: Customer.attributes
}];

/**
 * create a new bill.
 *
 * @desc  creates a new bill and saves them
 *        in the database
 *
 * @param {Object}  billData  Data for the bill to create
 */
exports.create = function create(billData) {
  debug('creating a new bill');

  let searchQuery = {};

  return co(function* () {

    let newBill = new Bill(billData);
    let bill = yield newBill.save();

    return yield exports.get({ _id: bill._id});

  }).then((bill) => {
    return Promise.resolve(bill);
  }).catch((err) => {
    return Promise.reject(err);
  });

};

/**
 * delete a bill
 *
 * @desc  delete data of the bill with the given
 *        id
 *
 * @param {Object}  query   Query Object
 */
exports.delete = function deleteItem(query) {
  debug(`deleting bill: ${query}`);

  return co(function* () {
    let bill = yield exports.get(query);
    let _empty = {};

    if(!bill) {
      return _empty;
    } else {
      yield bill.remove();

      return bill;
    }
  }).then((bill) => {
    return Promise.resolve(bill);
  }, (err) => {
    return Promise.reject(err);
  });
};

/**
 * update a bill
 *
 * @desc  update data of the bill with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 */
exports.update = function update(query, updates) {
  debug(`updating bill: ${query}`);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  let promise = Bill
      .findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a bill.
 *
 * @desc get a bill with the given id from db
 *
 * @param {Object} query Query Object
 */
exports.get = function get(query) {
  debug(`getting bill ${query}`);

  let promise = Bill
      .findOne(query, returnFields)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a collection of bills
 *
 * @desc get a collection of bills from db
 *
 * @param {Object} query Query Object
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of bills');

  return new Promise((resolve, reject) => {
    resolve(
       Bill
       .find(query, returnFields)
       .populate(population)
       .stream());
  });

};

/**
 * get a collection of bills using pagination
 *
 * @desc get a collection of bills from db
 *
 * @param {Object} query Query Object
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of bills');

  let opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };

  return new Promise((resolve, reject) => {
    Bill.paginate(query, opts, function (err, docs) {
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
