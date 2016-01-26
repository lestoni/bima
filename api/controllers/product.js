'use strict';
/** *
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:product-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');

const config          = require('../config');
const CustomError     = require('../lib/custom-error');
const ProductDal        = require('./dal/product');
const ProviderDal     = require('./dal/provider');
const Provider        = require('../models/provider');
const UserDal         = require('./dal/user');

/**
 * Create a product.
 *
 * @desc create a product and add them to the database
 *
 * @param {Function} next Middleware dispatcher
 */
exports.create = function* createProduct(next) {
  debug('create product');

  // Begin workflow
  let body = this.request.body;
  let user = this.state._user;

  this.checkBody('name')
      .notEmpty('Insurance Product name cannot be empty');
  this.checkBody('description')
      .notEmpty('Insurance Product description cannot be empty');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'PRODUCT_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let product;
    let query;
    let provider;
    let update;

    product = yield ProductDal.create(body);

    query = { user: user._id };
    provider = yield ProviderDal.get(query);

    query = { _id: provider._id };
    update = { $push: { products: product._id } };
    yield Provider.findOneAndUpdate(query, update).exec();

    this.status = 201;
    this.body = product;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'PRODUCT_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single product.
 *
 * @desc Fetch a product with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneProduct(next) {
  debug(`fetch product:${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let product = yield ProductDal.get(query);

    this.body = product;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single product.
 *
 * @desc Fetch a product with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateProduct(next) {
  debug(`updating product: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let product = yield ProductDal.update(query, body);

    this.body = product;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Delete/Archive a single product.
 *
 * @desc Fetch a product with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function* deleteProduct(next) {
  debug(`deleting product: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let product = yield ProductDal.delete(query);

    this.body = product;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of products with pagination
 *
 * @desc Fetch a collection of products
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllproducts(next) {
  debug('get a collection of products');

  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};
  let opts = {
    page: page,
    limit: limit,
    sort: { }
  };

  try {
    let products = yield ProductDal.getCollectionByPagination(query, opts);

    this.body = products;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of products
 *
 * @desc Fetch a collection of products
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAllproducts(next) {
  debug('get a collection of products');

  let query = {};
  let opts = {};

  try {
    let productsCollectionStream = yield ProductDal.getCollection(query, opts);
    let stream;

    this.type = 'json';

    stream = this.body = productsCollectionStream.pipe(jsonStream());

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
