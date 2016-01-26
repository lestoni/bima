'use strict';
/** *
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:transaction-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');

const config          = require('../config');
const CustomError     = require('../lib/custom-error');
const TransactionDal        = require('./dal/transaction');
const UserDal         = require('./dal/user');

/**
 * Create a transaction.
 *
 * @desc create a transaction and add them to the database
 *
 * @param {Function} next Middleware dispatcher
 */
exports.create = function* createTransaction(next) {
  debug('create transaction');

  // Begin workflow
  let body = this.request.body;

  this.checkBody('status')
      .notEmpty('Status is empty');
  this.checkBody('type')
      .notEmpty('Type is empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'TRANSACTION_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let transaction;

    transaction = yield TransactionDal.create(body);

    this.status = 201;
    this.body = transaction;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'TRANSACTION_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single transaction.
 *
 * @desc Fetch a transaction with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneTransaction(next) {
  debug(`fetch transaction:${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let transaction = yield TransactionDal.get(query);

    this.body = transaction;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single transaction.
 *
 * @desc Fetch a transaction with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateTransaction(next) {
  debug(`updating transaction: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let transaction = yield TransactionDal.update(query, body);

    this.body = transaction;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Delete/Archive a single transaction.
 *
 * @desc Fetch a transaction with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function* deleteTransaction(next) {
  debug(`deleting transaction: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let transaction = yield TransactionDal.delete(query);

    this.body = transaction;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of transactions with pagination
 *
 * @desc Fetch a collection of transactions
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAlltransactions(next) {
  debug('get a collection of transactions');

  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};
  let opts = {
    page: page,
    limit: limit,
    sort: { }
  };

  try {
    let transactions = yield TransactionDal.getCollectionByPagination(query, opts);

    this.body = transactions;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of transactions
 *
 * @desc Fetch a collection of transactions
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAlltransactions(next) {
  debug('get a collection of transactions');

  let query = {};
  let opts = {};

  try {
    let transactionsCollectionStream = yield TransactionDal.getCollection(query, opts);
    let stream;

    this.type = 'json';

    stream = this.body = transactionsCollectionStream.pipe(jsonStream());

    stream.on('error', (err) => {
      stream.end();

      return this.throw(new CustomError({
        type: 'SERVER_ERROR',
        message: 'Error retrieving collection'
      }));
    });
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: err.message
    }));
  }


};
