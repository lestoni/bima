'use strict';
// Access Layer for Product Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-product');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Product    = require('../../models/product');
const mongoUpdate = require('../../lib/mongo-update');

const returnFields = Product.attributes;
var population = [];

/**
 * create a new product.
 *
 * @desc  creates a new product and saves them
 *        in the database
 *
 * @param {Object}  productData  Data for the product to create
 */
exports.create = function create(productData) {
  debug('creating a new product');

  let searchQuery = {};

  return co(function* () {

    let newProduct = new Product(productData);
    let product = yield newProduct.save();

    return yield exports.get({ _id: product._id});

  }).then((product) => {
    return Promise.resolve(product);
  }).catch((err) => {
    return Promise.reject(err);
  });

};

/**
 * delete a product
 *
 * @desc  delete data of the product with the given
 *        id
 *
 * @param {Object}  query   Query Object
 */
exports.delete = function deleteItem(query) {
  debug(`deleting product: ${query}`);

  return co(function* () {
    let product = yield exports.get(query);
    let _empty = {};

    if(!product) {
      return _empty;
    } else {
      yield product.remove();

      return product;
    }
  }).then((product) => {
    return Promise.resolve(product);
  }, (err) => {
    return Promise.reject(err);
  });
};

/**
 * update a product
 *
 * @desc  update data of the product with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 */
exports.update = function update(query, updates) {
  debug(`updating product: ${query}`);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  let promise = Product
      .findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a product.
 *
 * @desc get a product with the given id from db
 *
 * @param {Object} query Query Object
 */
exports.get = function get(query) {
  debug(`getting product ${query}`);

  let promise = Product
      .findOne(query, returnFields)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a collection of products
 *
 * @desc get a collection of products from db
 *
 * @param {Object} query Query Object
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of products');

  return new Promise((resolve, reject) => {
    resolve(
       Product
       .find(query, returnFields)
       .populate(population)
       .stream());
  });

};

/**
 * get a collection of products using pagination
 *
 * @desc get a collection of products from db
 *
 * @param {Object} query Query Object
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of products');

  let opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };

  return new Promise((resolve, reject) => {
    Product.paginate(query, opts, function (err, docs) {
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
