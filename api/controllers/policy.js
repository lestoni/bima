'use strict';
/** *
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:policy-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');

const config          = require('../config');
const CustomError     = require('../lib/custom-error');
const PolicyDal        = require('./dal/policy');
const UserDal         = require('./dal/user');

/**
 * Create a policy.
 *
 * @desc create a policy and add them to the database
 *
 * @param {Function} next Middleware dispatcher
 */
exports.create = function* createPolicy(next) {
  debug('create policy');

  // Begin workflow
  let body = this.request.body;

  this.checkBody('customer')
      .notEmpty('Customer ID is empty')
      .isHexadecimal('Not a valid Customer ID');
  this.checkBody('provider')
      .notEmpty('Provider ID is empty')
      .isHexadecimal('Not a valid provider ID');
  this.checkBody('product')
      .notEmpty('Product ID is empty')
      .isHexadecimal('Not a valid Product ID');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'POLICY_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let policy;

    policy = yield PolicyDal.create(body);

    this.status = 201;
    this.body = policy;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'POLICY_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single policy.
 *
 * @desc Fetch a policy with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOnePolicy(next) {
  debug(`fetch policy:${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let policy = yield PolicyDal.get(query);

    this.body = policy;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single policy.
 *
 * @desc Fetch a policy with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updatePolicy(next) {
  debug(`updating policy: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let policy = yield PolicyDal.update(query, body);

    this.body = policy;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Delete/Archive a single policy.
 *
 * @desc Fetch a policy with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function* deletePolicy(next) {
  debug(`deleting policy: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let policy = yield PolicyDal.delete(query);

    this.body = policy;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of policies with pagination
 *
 * @desc Fetch a collection of policies
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllpolicies(next) {
  debug('get a collection of policies');

  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};
  let opts = {
    page: page,
    limit: limit,
    sort: { }
  };

  try {
    let policies = yield PolicyDal.getCollectionByPagination(query, opts);

    this.body = policies;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of policies
 *
 * @desc Fetch a collection of policies
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAllpolicies(next) {
  debug('get a collection of policies');

  let query = {};
  let opts = {};

  try {
    let policiesCollectionStream = yield PolicyDal.getCollection(query, opts);
    let stream;

    this.type = 'json';

    stream = this.body = policiesCollectionStream.pipe(jsonStream());

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
