'use strict';
/**
 * Transaction Router
 */

/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:transaction-router');

const transactionController     = require('../controllers/transaction');
const accessControl       = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {post} /transactions/create Create a transaction
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Transaction
 *
 * @apiDescription Create a new transaction.
 *
 * @apiParam {String} type Type of transaction either __renewal__, __claim__ or __quote__
 * @apiParam {String} status Status of transaction either __failed__ or __successful__
 *
 * @apiParamExample Request Example:
 *  {
 *    "type": "renewal",
 *    "status": "successful"
 *  }
 *
 * @apiSuccess {String} _id transaction id
 * @apiSuccess {String} type Type of transaction either __renewal__, __claim__ or __quote__
 * @apiSuccess {String} status Status of transaction either __failed__ or __successful__
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "type": "renewal",
 *    "status": "successful"
 *  }
 *
 */
router.post('/create', accessControl(['admin', 'agent', 'provider']), transactionController.create);

/**
 * @api {get} /transactions/:id Get Transaction
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Transaction
 *
 * @apiDescription Get a transaction with the given id
 *
 * @apiSuccess {String} _id transaction id
 * @apiSuccess {String} type Type of transaction either __renewal__, __claim__ or __quote__
 * @apiSuccess {String} status Status of transaction either __failed__ or __successful__
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "type": "renewal",
 *    "status": "successful"
 *  }
 */
router.get('/:id', accessControl(['agent', 'admin', 'provider']), transactionController.fetchOne);

/**
 * @api {put} /transactions/:id Update Transaction
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Transaction
 *
 * @apiDescription Update a transaction with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request Example:
 * {
 *
 * }
 *
 * @apiSuccess {String} _id transaction id
 * @apiSuccess {String} type Type of transaction either __renewal__, __claim__ or __quote__
 * @apiSuccess {String} status Status of transaction either __failed__ or __successful__
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "type": "renewal",
 *    "status": "successful"
 *  }
 *
 */
router.put('/:id', accessControl(['provider', 'agent', 'admin']), transactionController.update);

/**
 * @api {get} /transactions/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get transactions collection
 * @apiVersion 1.0.0
 * @apiName FetchAllByPagination
 * @apiGroup Transaction
 *
 * @apiDescription Get a collection of transactions. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id transaction id
 * @apiSuccess {String} type Type of transaction either __renewal__, __claim__ or __quote__
 * @apiSuccess {String} status Status of transaction either __failed__ or __successful__
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      "_id" : "556e1174a8952c9521286a60",
 *      "type": "renewal",
 *      "status": "successful"
 *    }]
 *  }
 *
 */
router.get('/paginate', accessControl(['admin', 'provider', 'agent']), transactionController.fetchAllByPagination);

/**
 * @api {get} /transactions/all Get transactions collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup Transaction
 *
 * @apiDescription Get a collection of transactions.
 *
 * @apiSuccess {String} _id transaction id
 * @apiSuccess {String} type Type of transaction either __renewal__, __claim__ or __quote__
 * @apiSuccess {String} status Status of transaction either __failed__ or __successful__
 *
 * @apiSuccessExample Response Example:
 *  [{
 *    "_id" : "556e1174a8952c9521286a60",
 *    "type": "renewal",
 *    "status": "successful"
 *  }]
 */
router.get('/all', accessControl(['admin', 'provider', 'agent']), transactionController.fetchAll);

/**
 * @api {delete} /transactions/:id Delete Transaction
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Transaction
 *
 * @apiDescription Delete a transaction with the given id
 *
 * @apiSuccess {String} _id transaction id
 * @apiSuccess {String} type Type of transaction either __renewal__, __claim__ or __quote__
 * @apiSuccess {String} status Status of transaction either __failed__ or __successful__
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "type": "renewal",
 *    "status": "successful"
 *  }
 *
 */
router.delete('/:id', accessControl(['agent', 'provider', 'admin']), transactionController.delete);

// Expose Transaction Transactionr
module.exports = router;

