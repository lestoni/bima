'use strict';
/** *
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:provider-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');

const config          = require('../config');
const CustomError     = require('../lib/custom-error');
const ProviderDal     = require('./dal/provider');
const UserDal         = require('./dal/user');

/**
 * Create a provider.
 *
 * @desc create a provider and add them to the database
 *
 * @param {Function} next Middleware dispatcher
 */
exports.create = function* createProvider(next) {
  debug('create provider');

  // Begin workflow
  let body = this.request.body;

  this.checkBody('user')
      .notEmpty('User ID is empty')
      .isHexadecimal('Not a valid User ID');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'PROVIDER_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let provider;

    provider = yield ProviderDal.create(body);

    this.status = 201;
    this.body = provider;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'PROVIDER_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single provider.
 *
 * @desc Fetch a provider with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneProvider(next) {
  debug(`fetch provider:${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let provider = yield ProviderDal.get(query);

    this.body = provider || {};

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single provider.
 *
 * @desc Fetch a provider with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateProvider(next) {
  debug(`updating provider: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let provider = yield ProviderDal.update(query, body);

    this.body = provider;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Delete/Archive a single provider.
 *
 * @desc Fetch a provider with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function* deleteProvider(next) {
  debug(`deleting provider: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let provider = yield ProviderDal.delete(query);

    this.body = provider;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of providers with pagination
 *
 * @desc Fetch a collection of providers
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllproviders(next) {
  debug('get a collection of providers');

  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};
  let opts = {
    page: page,
    limit: limit,
    sort: { }
  };

  try {
    let providers = yield ProviderDal.getCollectionByPagination(query, opts);

    this.body = providers;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of providers
 *
 * @desc Fetch a collection of providers
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAllproviders(next) {
  debug('get a collection of providers');

  let query = {};
  let opts = {};

  try {
    let providersCollectionStream = yield ProviderDal.getCollection(query, opts);
    let stream;

    this.type = 'json';

    stream = this.body = providersCollectionStream.pipe(jsonStream());

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
