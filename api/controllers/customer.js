'use strict';
/** *
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:customer-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');

const config          = require('../config');
const CustomError     = require('../lib/custom-error');
const CustomerDal        = require('./dal/customer');
const UserDal         = require('./dal/user');

/**
 * Create a customer.
 *
 * @desc create a customer and add them to the database
 *
 * @param {Function} next Middleware dispatcher
 */
exports.create = function* createCustomer(next) {
  debug('create customer');

  // Begin workflow
  let body = this.request.body;

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CUSTOMER_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let customer;

    customer = yield CustomerDal.create(body);

    this.status = 201;
    this.body = customer;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'CUSTOMER_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single customer.
 *
 * @desc Fetch a customer with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneCustomer(next) {
  debug(`fetch customer:${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let customer = yield CustomerDal.get(query);

    this.body = customer;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single customer.
 *
 * @desc Fetch a customer with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateCustomer(next) {
  debug(`updating customer: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let customer = yield CustomerDal.update(query, body);

    this.body = customer;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Delete/Archive a single customer.
 *
 * @desc Fetch a customer with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function* deleteCustomer(next) {
  debug(`deleting customer: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let customer = yield CustomerDal.delete(query);

    this.body = customer;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of customers with pagination
 *
 * @desc Fetch a collection of customers
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllcustomers(next) {
  debug('get a collection of customers');

  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};
  let opts = {
    page: page,
    limit: limit,
    sort: { }
  };

  try {
    let customers = yield CustomerDal.getCollectionByPagination(query, opts);

    this.body = customers;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of customers
 *
 * @desc Fetch a collection of customers
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAllcustomers(next) {
  debug('get a collection of customers');

  let query = {};
  let opts = {};

  try {
    let customersCollectionStream = yield CustomerDal.getCollection(query, opts);
    let stream;

    this.type = 'json';

    stream = this.body = customersCollectionStream.pipe(jsonStream());

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
