'use strict';
// Access Layer for Transaction Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-transaction');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Transaction    = require('../../models/transaction');
const mongoUpdate = require('../../lib/mongo-update');

const returnFields = Transaction.attributes;
var population = [];

/**
 * create a new transaction.
 *
 * @desc  creates a new transaction and saves them
 *        in the database
 *
 * @param {Object}  transactionData  Data for the transaction to create
 */
exports.create = function create(transactionData) {
  debug('creating a new transaction');

  let searchQuery = {};

  return co(function* () {
    let newTransaction = new Transaction(transactionData);
    let transaction = yield newTransaction.save();

    return yield exports.get({ _id: transaction._id});

  }).then((transaction) => {
    return Promise.resolve(transaction);
  }).catch((err) => {
    return Promise.reject(err);
  });

};

/**
 * delete a transaction
 *
 * @desc  delete data of the transaction with the given
 *        id
 *
 * @param {Object}  query   Query Object
 */
exports.delete = function deleteItem(query) {
  debug(`deleting transaction: ${query}`);

  return co(function* () {
    let transaction = yield exports.get(query);
    let _empty = {};

    if(!transaction) {
      return _empty;
    } else {
      yield transaction.remove();

      return transaction;
    }
  }).then((transaction) => {
    return Promise.resolve(transaction);
  }, (err) => {
    return Promise.reject(err);
  });
};

/**
 * update a transaction
 *
 * @desc  update data of the transaction with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 */
exports.update = function update(query, updates) {
  debug(`updating transaction: ${query}`);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  let promise = Transaction
      .findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a transaction.
 *
 * @desc get a transaction with the given id from db
 *
 * @param {Object} query Query Object
 */
exports.get = function get(query) {
  debug(`getting transaction ${query}`);

  let promise = Transaction
      .findOne(query, returnFields)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a collection of transactions
 *
 * @desc get a collection of transactions from db
 *
 * @param {Object} query Query Object
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of transactions');

  return new Promise((resolve, reject) => {
    resolve(
       Transaction
       .find(query, returnFields)
       .populate(population)
       .stream());
  });

};

/**
 * get a collection of transactions using pagination
 *
 * @desc get a collection of transactions from db
 *
 * @param {Object} query Query Object
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of transactions');

  let opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };

  return new Promise((resolve, reject) => {
    Transaction.paginate(query, opts, function (err, docs) {
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
