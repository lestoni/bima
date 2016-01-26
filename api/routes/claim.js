'use strict';
/**
 * Claim Router
 */

/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:claim-router');

const claimController     = require('../controllers/claim');
const accessControl          = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {post} /claims/create Create a claim
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Claim
 *
 * @apiDescription Create a new claim with the corresponding Claimant.
 *
 * @apiParam {String} policy Referenced Policy ID
 * @apiParam {String} claim_date Date when claim was placed
 * @apiParam {String} incident_description Incident description
 * @apiParam {String} incident_date When the incident occurred
 * @apiParam {String} place_of_occurence Where the incident happended
 * @apiParam {String} additional_info Additional Information
 * @apiParam {String} customer Referenced Customer ID
 * @apiParam {String} provider Referenced Provider ID
 * @apiParam {String} claim_status Status of the claim
 *
 * @apiParamExample Request Example:
 *  {
 *    "customer" : "556e1174a8952c9521286a60",
 *    "policy" : "356e1174a8952c9521286a60",
 *    "provider" : "1256e1174a8952c9521286a60",
 *    "claim_status": "pending",
 *    "place_of_occurence": "Home",
 *    "additional_info": "I didnt do it",
 *    "incident_description": "Cat knocked over lighter",
 *    "incident_date": "2016-01-22T00:45:45.811Z",
 *    "claim_date": "2016-01-22T00:45:45.811Z"
 *  }
 *
 * @apiSuccess {String} _id claim id
 * @apiSuccess {Object} policy Referenced Policy Data
 * @apiSuccess {String} claim_date Date when claim was placed
 * @apiSuccess {String} incident_description Incident description
 * @apiSuccess {String} incident_date When the incident occurred
 * @apiSuccess {String} place_of_occurence Where the incident happended
 * @apiSuccess {String} additional_info Additional Information
 * @apiSuccess {Array} photo_evidence Urls of photo evidences
 * @apiSuccess {Object} claimant Claimant of this claim
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "place_of_occurence": "Home",
 *    "additional_info": "I didnt do it",
 *    "incident_description": "Cat knocked over lighter",
 *    "incident_date": "2016-01-22T00:45:45.811Z",
 *    "claim_date": "2016-01-22T00:45:45.811Z"
 *    "claimant": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "photo_evidence": ["url/photo.jpeg",...]
 *  }
 *
 */
router.post('/create', accessControl(['*']), claimController.create);

/**
 * @api {get} /claims/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get claims collection
 * @apiVersion 1.0.0
 * @apiName FetchAllByPagination
 * @apiGroup Claim
 *
 * @apiDescription Get a collection of claims. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id claim id
 * @apiSuccess {Object} policy Referenced Policy Data
 * @apiSuccess {String} claim_date Date when claim was placed
 * @apiSuccess {String} incident_description Incident description
 * @apiSuccess {String} incident_date When the incident occurred
 * @apiSuccess {String} place_of_occurence Where the incident happended
 * @apiSuccess {String} additional_info Additional Information
 * @apiSuccess {Object} claimant Claimant of this claim
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      "_id" : "556e1174a8952c9521286a60"
 *      "claim_status": "pending",
 *      "place_of_occurence": "Home",
 *      "additional_info": "I didnt do it",
 *      "incident_description": "Cat knocked over lighter",
 *      "incident_date": "2016-01-22T00:45:45.811Z",
 *      "claim_date": "2016-01-22T00:45:45.811Z"
 *      "claimant": {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      "policy": {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      "photo_evidence": ["url/photo.jpeg",...]
 *    }]
 *  }
 *
 */
router.get('/paginate', accessControl(['*']), claimController.fetchAllByPagination);

/**
 * @api {get} /claims/all Get claims collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup Claim
 *
 * @apiDescription Get a collection of claims.
 *
 * @apiSuccess {String} _id claim id
 * @apiSuccess {Object} policy Referenced Policy Data
 * @apiSuccess {String} claim_date Date when claim was placed
 * @apiSuccess {String} incident_description Incident description
 * @apiSuccess {String} incident_date When the incident occurred
 * @apiSuccess {String} place_of_occurence Where the incident happended
 * @apiSuccess {String} additional_info Additional Information
 * @apiSuccess {Object} claimant Claimant of this claim
 *
 * @apiSuccessExample Response Example:
 *  [{
 *    "_id" : "556e1174a8952c9521286a60"
 *    "claim_status": "pending",
 *    "place_of_occurence": "Home",
 *    "additional_info": "I didnt do it",
 *    "incident_description": "Cat knocked over lighter",
 *    "incident_date": "2016-01-22T00:45:45.811Z",
 *    "claim_date": "2016-01-22T00:45:45.811Z"
 *    "claimant": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "photo_evidence": ["url/photo.jpeg",...]
 *  }]
 *
 */
router.get('/all', accessControl(['*']), claimController.fetchAll);

/**
 * @api {post} /claims/:id/photo_evidences Uplod claim photo evidences
 * @apiVersion 1.0.0
 * @apiName UploadPhotoEvidences
 * @apiGroup Claim
 *
 * @apiDescription Upload photo evidences to support the claim. Use __multipart/form-data__.
 * Each photo should be prefixed with _photo_evidence_(photo_number)_.
 *
 * @apiParam {Buffer} photo_evidence_* Corresponding photo value
 *
 * @apiParamExample Request Example(__Should be submitted as _multipart/form-data_ not JSON):
 *  {
 *    "photo_evidence_1" : <BUFFER_DATA>,
 *    "photo_evidence_2" : <BUFFER_DATA>,
 *    "photo_evidence_3" : <BUFFER_DATA>,
 *    ..
 *  }
 *
 * @apiSuccess {String} _id claim id
 * @apiSuccess {Object} policy Referenced Policy Data
 * @apiSuccess {String} claim_date Date when claim was placed
 * @apiSuccess {String} incident_description Incident description
 * @apiSuccess {String} incident_date When the incident occurred
 * @apiSuccess {String} place_of_occurence Where the incident happended
 * @apiSuccess {String} additional_info Additional Information
 * @apiSuccess {Object} claimant Claimant of this claim
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "place_of_occurence": "Home",
 *    "additional_info": "I didnt do it",
 *    "incident_description": "Cat knocked over lighter",
 *    "incident_date": "2016-01-22T00:45:45.811Z",
 *    "claim_date": "2016-01-22T00:45:45.811Z"
 *    "claimant": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "photo_evidence": ["url/photo.jpeg",...]
 *  }
 *
 */
router.post('/:id/photo_evidences', accessControl('*'), claimController.uploadEvidencePhotos)

/**
 * @api {get} /claims/:id Get Claim
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Claim
 *
 * @apiDescription Get a claim with the given id
 *
 * @apiSuccess {String} _id claim id
 * @apiSuccess {Object} policy Referenced Policy Data
 * @apiSuccess {String} claim_date Date when claim was placed
 * @apiSuccess {String} incident_description Incident description
 * @apiSuccess {String} incident_date When the incident occurred
 * @apiSuccess {String} place_of_occurence Where the incident happended
 * @apiSuccess {String} additional_info Additional Information
 * @apiSuccess {Object} claimant Claimant of this claim
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "claim_status": "pending",
 *    "place_of_occurence": "Home",
 *    "additional_info": "I didnt do it",
 *    "incident_description": "Cat knocked over lighter",
 *    "incident_date": "2016-01-22T00:45:45.811Z",
 *    "claim_date": "2016-01-22T00:45:45.811Z"
 *    "claimant": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "photo_evidence": ["url/photo.jpeg",...]
 *  }
 */
router.get('/:id', accessControl(['*']), claimController.fetchOne);

/**
 * @api {put} /claims/:id Update Claim
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Claim
 *
 * @apiDescription Update a claim with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request Example:
 * {
 *
 * }
 *
 * @apiSuccess {String} _id claim id
 * @apiSuccess {Object} policy Referenced Policy Data
 * @apiSuccess {String} claim_date Date when claim was placed
 * @apiSuccess {String} incident_description Incident description
 * @apiSuccess {String} incident_date When the incident occurred
 * @apiSuccess {String} place_of_occurence Where the incident happended
 * @apiSuccess {String} additional_info Additional Information
 * @apiSuccess {Object} claimant Claimant of this claim
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "claim_status": "pending",
 *    "place_of_occurence": "Home",
 *    "additional_info": "I didnt do it",
 *    "incident_description": "Cat knocked over lighter",
 *    "incident_date": "2016-01-22T00:45:45.811Z",
 *    "claim_date": "2016-01-22T00:45:45.811Z"
 *    "claimant": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "photo_evidence": ["url/photo.jpeg",...]
 *  }
 */
router.put('/:id', accessControl(['*']), claimController.update);


/**
 * @api {delete} /claims/:id Delete Claim
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Claim
 *
 * @apiDescription Delete a claim with the given id
 *
 * @apiSuccess {String} _id claim id
 * @apiSuccess {Object} policy Referenced Policy Data
 * @apiSuccess {String} claim_date Date when claim was placed
 * @apiSuccess {String} incident_description Incident description
 * @apiSuccess {String} incident_date When the incident occurred
 * @apiSuccess {String} place_of_occurence Where the incident happended
 * @apiSuccess {String} additional_info Additional Information
 * @apiSuccess {Object} claimant Claimant of this claim
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "claim_status": "pending",
 *    "place_of_occurence": "Home",
 *    "additional_info": "I didnt do it",
 *    "incident_description": "Cat knocked over lighter",
 *    "incident_date": "2016-01-22T00:45:45.811Z",
 *    "claim_date": "2016-01-22T00:45:45.811Z"
 *    "claimant": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "photo_evidence": ["url/photo.jpeg",...]
 *  }
 *
 */
router.delete('/:id', accessControl(['*']), claimController.delete);


// Expose Claim Router
module.exports = router;
