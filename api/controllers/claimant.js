'use strict';
/** *
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:claimant-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');

const config          = require('../config');
const CustomError     = require('../lib/custom-error');
const ClaimantDal        = require('./dal/claimant');
const UserDal         = require('./dal/user');

/**
 * Create a claimant.
 *
 * @desc create a claimant and add them to the database
 *
 * @param {Function} next Middleware dispatcher
 */
exports.create = function* createClaimant(next) {
  debug('create claimant');

  // Begin workflow
  let body = this.request.body;

  this.checkBody('claim')
      .notEmpty('Claim ID is empty')
      .isHexadecimal('Not a valid Claim ID');
  this.checkBody('customer')
      .notEmpty('Customer ID is empty')
      .isHexadecimal('Not a valid Customer ID');
  this.checkBody('provider')
      .notEmpty('Provider ID is empty')
      .isHexadecimal('Not a valid Provider ID');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CLAIMANT_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let claimant;

    claimant = yield ClaimantDal.create(body);

    this.status = 201;
    this.body = claimant;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'CLAIMANT_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single claimant.
 *
 * @desc Fetch a claimant with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneClaimant(next) {
  debug(`fetch claimant:${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let claimant = yield ClaimantDal.get(query);

    this.body = claimant;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single claimant.
 *
 * @desc Fetch a claimant with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateClaimant(next) {
  debug(`updating claimant: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let claimant = yield ClaimantDal.update(query, body);

    this.body = claimant;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Delete/Archive a single claimant.
 *
 * @desc Fetch a claimant with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function* deleteClaimant(next) {
  debug(`deleting claimant: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let claimant = yield ClaimantDal.delete(query);

    this.body = claimant;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of claimants with pagination
 *
 * @desc Fetch a collection of claimants
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllclaimants(next) {
  debug('get a collection of claimants');

  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};
  let opts = {
    page: page,
    limit: limit,
    sort: { }
  };

  try {
    let claimants = yield ClaimantDal.getCollectionByPagination(query, opts);

    this.body = claimants;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of claimants
 *
 * @desc Fetch a collection of claimants
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAllclaimants(next) {
  debug('get a collection of claimants');

  let query = {};
  let opts = {};

  try {
    let claimantsCollectionStream = yield ClaimantDal.getCollection(query, opts);
    let stream;

    this.type = 'json';

    stream = this.body = claimantsCollectionStream.pipe(jsonStream());

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
