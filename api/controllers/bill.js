'use strict';
/** *
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:bill-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');

const config          = require('../config');
const CustomError     = require('../lib/custom-error');
const BillDal        = require('./dal/bill');
const UserDal         = require('./dal/user');

/**
 * Create a bill.
 *
 * @desc create a bill and add them to the database
 *
 * @param {Function} next Middleware dispatcher
 */
exports.create = function* createBill(next) {
  debug('create bill');

  // Begin workflow
  let body = this.request.body;

  this.checkBody('customer')
      .notEmpty('Customer ID is empty')
      .isHexadecimal('Not a valid Customer ID');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'BILL_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let bill;

    bill = yield BillDal.create(body);

    this.status = 201;
    this.body = bill;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'BILL_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single bill.
 *
 * @desc Fetch a bill with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneBill(next) {
  debug(`fetch bill:${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let bill = yield BillDal.get(query);

    this.body = bill;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single bill.
 *
 * @desc Fetch a bill with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateBill(next) {
  debug(`updating bill: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let bill = yield BillDal.update(query, body);

    this.body = bill;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Delete/Archive a single bill.
 *
 * @desc Fetch a bill with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function* deleteBill(next) {
  debug(`deleting bill: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let bill = yield BillDal.delete(query);

    this.body = bill;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of bills with pagination
 *
 * @desc Fetch a collection of bills
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllbills(next) {
  debug('get a collection of bills');

  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};
  let opts = {
    page: page,
    limit: limit,
    sort: { }
  };

  try {
    let bills = yield BillDal.getCollectionByPagination(query, opts);

    this.body = bills;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of bills
 *
 * @desc Fetch a collection of bills
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAllbills(next) {
  debug('get a collection of bills');

  let query = {};
  let opts = {};

  try {
    let billsCollectionStream = yield BillDal.getCollection(query, opts);
    let stream;

    this.type = 'json';

    stream = this.body = billsCollectionStream.pipe(jsonStream());

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
