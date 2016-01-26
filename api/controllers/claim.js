'use strict';
/** *
 * Load Module Dependencies.
 */
const path = require('path');

const debug      = require('debug')('api:claim-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');

const config          = require('../config');
const CustomError     = require('../lib/custom-error');
const ClaimDal        = require('./dal/claim');
const Claim           = require('../models/claim');
const ClaimantDal     = require('./dal/claimant');
const UserDal         = require('./dal/user');

/**
 * Create a claim.
 *
 * @desc create a claim and add them to the database
 *
 * @param {Function} next Middleware dispatcher
 */
exports.create = function* createClaim(next) {
  debug('create claim');

  // Begin workflow
  let body = this.request.body;

  this.checkBody('customer')
      .notEmpty('Customer ID is empty')
      .isHexadecimal('Not a valid Customer ID');
  this.checkBody('provider')
      .notEmpty('Provider ID is empty')
      .isHexadecimal('Not a valid Provider ID');
  this.checkBody('policy')
      .notEmpty('Policy ID is empty')
      .isHexadecimal('Not a valid Policy ID');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'CLAIM_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let claim;
    let claimant;
    let claimData;
    let claimantData;

    claimData = {
      policy: body.policy,
      claim_date: body.claim_date,
      incident_description: body.incident_description,
      incident_date: body.incident_date,
      place_of_occurence: body.place_of_occurence,
      additional_info: body.additional_info
    };
    claimantData = {
      customer: body.customer,
      provider: body.provider,
      claim_status: body.claim_status
    };

    // Create Claim first
    claim = yield ClaimDal.create(claimData);

    // Set claim attribute for the claimant
    claimantData.claim = claim._id;

    // Create claimant
    claimant = yield ClaimantDal.create(claimantData);

    // Update claim with the claimant ID
    claim = yield ClaimDal.update({ _id: claim._id }, { claimant: claimant._id });

    this.status = 201;
    this.body = claim;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'CLAIM_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single claim.
 *
 * @desc Fetch a claim with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneClaim(next) {
  debug(`fetch claim:${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let claim = yield ClaimDal.get(query);

    this.body = claim;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single claim.
 *
 * @desc Fetch a claim with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateClaim(next) {
  debug(`updating claim: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let claim = yield ClaimDal.update(query, body);

    this.body = claim;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Delete/Archive a single claim.
 *
 * @desc Fetch a claim with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function* deleteClaim(next) {
  debug(`deleting claim:  ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let claim = yield ClaimDal.delete(query);

    this.body = claim;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of claims with pagination
 *
 * @desc Fetch a collection of claims
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllclaims(next) {
  debug('get a collection of claims');

  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};
  let opts = {
    page: page,
    limit: limit,
    sort: { }
  };

  try {
    let claims = yield ClaimDal.getCollectionByPagination(query, opts);

    this.body = claims;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of claims
 *
 * @desc Fetch a collection of claims
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAllclaims(next) {
  debug('get a collection of claims');

  let query = {};
  let opts = {};

  try {
    let claimsCollectionStream = yield ClaimDal.getCollection(query, opts);
    let stream;

    this.type = 'json';

    stream = this.body = claimsCollectionStream.pipe(jsonStream());

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
      message: ex.message
    }));
  }

};

/**
 * Upload Evidence Photos
 *
 * @desc upload photos of evidence that support claim
 *
 * @param {Function} next Middleware dispatcher
 */
exports.uploadEvidencePhotos = function* uploadPhotos(next) {
  debug('upload evidence photos');

  let body = this.request.body
  let fields = Object.keys(body.files);
  let isPhotoEvidence = /photo_evidence/;
  let urls = [];

  for(let field of fields) {
    if(isPhotoEvidence.test(field)) {
      let url = config.MEDIA.URL + path.basename(body.files[field].path);
      urls.push(url);
    }
  }

  try {
    let query = { _id: this.params.id };
    let update = {
      $push: {
        photo_evidence: { $each: urls }
      }
    };

    yield Claim.findOneAndUpdate(query, update).exec();

    let claim = yield ClaimDal.get(query);

    this.body = claim;
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'CLAIM_PHOTO_EVIDENCE_UPLOAD_ERROR',
      message: ex.message
    }));
  }
};
