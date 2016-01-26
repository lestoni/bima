'use strict';
/**
 * Claimant Router
 */

/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:claimant-router');

const claimantController     = require('../controllers/claimant');
const accessControl          = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {get} /claimants/:id Get Claimant
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Claimant
 *
 * @apiDescription Get a claimant with the given id
 *
 * @apiSuccess {String} _id claimant id
 * @apiSuccess {Object} claim Referenced Claim data
 * @apiSuccess {Object} customer Referenced Customer data
 * @apiSuccess {Object} provider Reference Provider data
 * @apiSuccess {String} claim_status Status of the Claim either __rejected__, __pending__ or __issued__
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "claim_status": "pending",
 *    "customer": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *    "provider": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *    "claim": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 */
router.get('/:id', accessControl(['*']), claimantController.fetchOne);

/**
 * @api {put} /claimants/:id Update Claimant
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Claimant
 *
 * @apiDescription Update a claimant with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request Example:
 * {
 *
 * }
 *
 * @apiSuccess {String} _id claimant id
 * @apiSuccess {Object} claim Referenced Claim data
 * @apiSuccess {Object} customer Referenced Customer data
 * @apiSuccess {Object} provider Reference Provider data
 * @apiSuccess {String} claim_status Status of the Claim either __rejected__, __pending__ or __issued__
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "claim_status": "pending",
 *    "customer": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *    "provider": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *    "claim": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 */
router.put('/:id', accessControl(['*']), claimantController.update);

/**
 * @api {get} /claimants/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get claimants collection
 * @apiVersion 1.0.0
 * @apiName FetchAllByPagination
 * @apiGroup Claimant
 *
 * @apiDescription Get a collection of claimants. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id claimant id
 * @apiSuccess {Object} claim Referenced Claim data
 * @apiSuccess {Object} customer Referenced Customer data
 * @apiSuccess {Object} provider Reference Provider data
 * @apiSuccess {String} claim_status Status of the Claim either __rejected__, __pending__ or __issued__
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      "_id" : "556e1174a8952c9521286a60"
 *      "claim_status": "pending",
 *      "customer": {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      }
 *      "provider": {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      }
 *      "claim": {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      }
 *    }]
 *  }
 *
 */
router.get('/paginate', accessControl(['admin', 'provider', 'agent']), claimantController.fetchAllByPagination);

/**
 * @api {get} /claimants/all Get claimants collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup Claimant
 *
 * @apiDescription Get a collection of claimants.
 *
 * @apiSuccess {String} _id claimant id
 * @apiSuccess {Object} claim Referenced Claim data
 * @apiSuccess {Object} customer Referenced Customer data
 * @apiSuccess {Object} provider Reference Provider data
 * @apiSuccess {String} claim_status Status of the Claim either __rejected__, __pending__ or __issued__
 *
 * @apiSuccessExample Response Example:
 *  [{
 *    "_id" : "556e1174a8952c9521286a60"
 *    "claim_status": "pending",
 *    "customer": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *    "provider": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *    "claim": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }]
 *
 */
router.get('/all', accessControl(['admin', 'provider', 'agent']), claimantController.fetchAll);

/**
 * @api {delete} /claimants/:id Delete Claimant
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Claimant
 *
 * @apiDescription Delete a claimant with the given id
 *
 * @apiSuccess {String} _id claimant id
 * @apiSuccess {Object} claim Referenced Claim data
 * @apiSuccess {Object} customer Referenced Customer data
 * @apiSuccess {Object} provider Reference Provider data
 * @apiSuccess {String} claim_status Status of the Claim either __rejected__, __pending__ or __issued__
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "claim_status": "pending",
 *    "customer": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *    "provider": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *    "claim": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 */
router.delete('/:id', accessControl(['agent', 'provider', 'admin']), claimantController.delete);

// Expose Claimant Claimantr
module.exports = router;

