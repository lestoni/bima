'use strict';
/** *
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:payment-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');

const config          = require('../config');
const CustomError     = require('../lib/custom-error');
const PaymentDal        = require('./dal/payment');
const UserDal         = require('./dal/user');

/**
 * Create a payment.
 *
 * @desc create a payment and add them to the database
 *
 * @param {Function} next Middleware dispatcher
 */
exports.create = function* createPayment(next) {
  debug('create payment');

  // Begin workflow
  let body = this.request.body;

  this.checkBody('bill')
      .notEmpty('Bill ID is empty')
      .isHexadecimal('Not a valid Bill ID');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'PAYMENT_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let payment;

    payment = yield PaymentDal.create(body);

    this.status = 201;
    this.body = payment;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'PAYMENT_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single payment.
 *
 * @desc Fetch a payment with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOnePayment(next) {
  debug(`fetch payment:${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let payment = yield PaymentDal.get(query);

    this.body = payment;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single payment.
 *
 * @desc Fetch a payment with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updatePayment(next) {
  debug(`updating payment: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let payment = yield PaymentDal.update(query, body);

    this.body = payment;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Delete/Archive a single payment.
 *
 * @desc Fetch a payment with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function* deletePayment(next) {
  debug(`deleting payment: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let payment = yield PaymentDal.delete(query);

    this.body = payment;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of payments with pagination
 *
 * @desc Fetch a collection of payments
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllpayments(next) {
  debug('get a collection of payments');

  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};
  let opts = {
    page: page,
    limit: limit,
    sort: { }
  };

  try {
    let payments = yield PaymentDal.getCollectionByPagination(query, opts);

    this.body = payments;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of payments
 *
 * @desc Fetch a collection of payments
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAllpayments(next) {
  debug('get a collection of payments');

  let query = {};
  let opts = {};

  try {
    let paymentsCollectionStream = yield PaymentDal.getCollection(query, opts);
    let stream;

    this.type = 'json';

    stream = this.body = paymentsCollectionStream.pipe(jsonStream());

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
