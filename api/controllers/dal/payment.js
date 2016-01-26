'use strict';
// Access Layer for Payment Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-payment');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Payment       = require('../../models/payment');
const Bill          = require('../../models/bill');
const mongoUpdate = require('../../lib/mongo-update');

const returnFields = Payment.attributes;
var population = [{
  path: 'bill',
  select: Bill.attributes
}];

/**
 * create a new payment.
 *
 * @desc  creates a new payment and saves them
 *        in the database
 *
 * @param {Object}  paymentData  Data for the payment to create
 */
exports.create = function create(paymentData) {
  debug('creating a new payment');

  let searchQuery = {};

  return co(function* () {

    let newPayment = new Payment(paymentData);
    let payment = yield newPayment.save();

    return yield exports.get({ _id: payment._id});

  }).then((payment) => {
    return Promise.resolve(payment);
  }).catch((err) => {
    return Promise.reject(err);
  });

};

/**
 * delete a payment
 *
 * @desc  delete data of the payment with the given
 *        id
 *
 * @param {Object}  query   Query Object
 */
exports.delete = function deleteItem(query) {
  debug(`deleting payment: ${query}`);

  return co(function* () {
    let payment = yield exports.get(query);
    let _empty = {};

    if(!payment) {
      return _empty;
    } else {
      yield payment.remove();

      return payment;
    }
  }).then((payment) => {
    return Promise.resolve(payment);
  }, (err) => {
    return Promise.reject(err);
  });
};

/**
 * update a payment
 *
 * @desc  update data of the payment with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 */
exports.update = function update(query, updates) {
  debug(`updating payment: ${query}`);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  let promise = Payment
      .findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a payment.
 *
 * @desc get a payment with the given id from db
 *
 * @param {Object} query Query Object
 */
exports.get = function get(query) {
  debug(`getting payment ${query}`);

  let promise = Payment
      .findOne(query, returnFields)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a collection of payments
 *
 * @desc get a collection of payments from db
 *
 * @param {Object} query Query Object
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of payments');

  return new Promise((resolve, reject) => {
    resolve(
       Payment
       .find(query, returnFields)
       .populate(population)
       .stream());
  });

};

/**
 * get a collection of payments using pagination
 *
 * @desc get a collection of payments from db
 *
 * @param {Object} query Query Object
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of payments');

  let opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };

  return new Promise((resolve, reject) => {
    Payment.paginate(query, opts, function (err, docs) {
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
