'use strict';
/**
 * Bill Router
 */

/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:bill-router');

const billController     = require('../controllers/bill');
const accessControl       = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {post} /bills/create Create a bill
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Bill
 *
 * @apiDescription Create a new bill.
 *
 * @apiParam {string} due_date due date in iso format(utc)
 * @apiParam {number} amount amount for the bill
 * @apiParam {string} policy_number policy number
 * @apiParam {string} customer customer assigned id
 * @apiParam {string} status bill status either __paid__ or __overdue__
 *
 * @apiParamExample Request Example:
 *  {
 *    "customer" : "556e1174a8952c9521286a60",
 *    "due_date" : "2016-01-21T23:06:00.055Z",
 *    "amount" : 1000,
 *    "policy_number": "A0E9E13C3A03157DD9EAE3E9",
 *    "status": "paid"
 *  }
 *
 * @apiSuccess {String} _id bill id
 * @apiSuccess {string} due_date due date in iso format(utc)
 * @apiSuccess {number} amount amount for the bill
 * @apiSuccess {string} policy_number policy number
 * @apiSuccess {string} customer customer assigned id
 * @apiSuccess {string} status bill status either __paid__ or __overdue__
 * @apiSuccess {Object} customer Customer Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "due_date" : "2016-01-21T23:06:00.055Z",
 *    "amount" : 1000,
 *    "policy_number": "A0E9E13C3A03157DD9EAE3E9",
 *    "status": "paid",
 *    "customer": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 */
router.post('/create', accessControl(['admin', 'agent', 'provider']), billController.create);

/**
 * @api {get} /bills/:id Get Bill
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Bill
 *
 * @apiDescription Get a bill with the given id
 *
 * @apiSuccess {String} _id bill id
 * @apiSuccess {string} due_date due date in iso format(utc)
 * @apiSuccess {number} amount amount for the bill
 * @apiSuccess {string} policy_number policy number
 * @apiSuccess {string} customer customer assigned id
 * @apiSuccess {string} status bill status either __paid__ or __overdue__
 * @apiSuccess {Object} customer Customer Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "due_date" : "2016-01-21T23:06:00.055Z",
 *    "amount" : 1000,
 *    "policy_number": "A0E9E13C3A03157DD9EAE3E9",
 *    "status": "paid",
 *    "customer": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 *
 */
router.get('/:id', accessControl(['agent', 'admin', 'provider']), billController.fetchOne);

/**
 * @api {put} /bills/:id Update Bill
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Bill
 *
 * @apiDescription Update a bill with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request Example:
 * {
 *
 * }
 *
 * @apiSuccess {String} _id bill id
 * @apiSuccess {string} due_date due date in iso format(utc)
 * @apiSuccess {number} amount amount for the bill
 * @apiSuccess {string} policy_number policy number
 * @apiSuccess {string} customer customer assigned id
 * @apiSuccess {string} status bill status either __paid__ or __overdue__
 * @apiSuccess {Object} customer Customer Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "due_date" : "2016-01-21T23:06:00.055Z",
 *    "amount" : 1000,
 *    "policy_number": "A0E9E13C3A03157DD9EAE3E9",
 *    "status": "paid",
 *    "customer": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 *
 */
router.put('/:id', accessControl(['provider', 'agent', 'admin']), billController.update);

/**
 * @api {get} /bills/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get bills collection
 * @apiVersion 1.0.0
 * @apiName FetchAllByPagination
 * @apiGroup Bill
 *
 * @apiDescription Get a collection of bills. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id bill id
 * @apiSuccess {string} due_date due date in iso format(utc)
 * @apiSuccess {number} amount amount for the bill
 * @apiSuccess {string} policy_number policy number
 * @apiSuccess {string} customer customer assigned id
 * @apiSuccess {string} status bill status either __paid__ or __overdue__
 * @apiSuccess {Object} customer Customer Data
 *
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      "_id" : "556e1174a8952c9521286a60"
 *      "due_date" : "2016-01-21T23:06:00.055Z",
 *      "amount" : 1000,
 *      "policy_number": "A0E9E13C3A03157DD9EAE3E9",
 *      "status": "paid",
 *      "customer": {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      }
 *    }]
 *  }
 *
 */
router.get('/paginate', accessControl(['admin', 'provider', 'agent']), billController.fetchAllByPagination);

/**
 * @api {get} /bills/all Get bills collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup Bill
 *
 * @apiDescription Get a collection of bills.
 *
 * @apiSuccess {String} _id bill id
 * @apiSuccess {string} due_date due date in iso format(utc)
 * @apiSuccess {number} amount amount for the bill
 * @apiSuccess {string} policy_number policy number
 * @apiSuccess {string} customer customer assigned id
 * @apiSuccess {string} status bill status either __paid__ or __overdue__
 * @apiSuccess {Object} customer Customer Data
 *
 * @apiSuccessExample Response Example:
 *  [{
 *    "_id" : "556e1174a8952c9521286a60"
 *    "due_date" : "2016-01-21T23:06:00.055Z",
 *    "amount" : 1000,
 *    "policy_number": "A0E9E13C3A03157DD9EAE3E9",
 *    "status": "paid",
 *    "customer": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }]
 *
 */
router.get('/all', accessControl(['admin', 'provider', 'agent']), billController.fetchAll);

/**
 * @api {delete} /bills/:id Delete Bill
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Bill
 *
 * @apiDescription Delete a bill with the given id
 *
 * @apiSuccess {String} _id bill id
 * @apiSuccess {string} due_date due date in iso format(utc)
 * @apiSuccess {number} amount amount for the bill
 * @apiSuccess {string} policy_number policy number
 * @apiSuccess {string} customer customer assigned id
 * @apiSuccess {string} status bill status either __paid__ or __overdue__
 * @apiSuccess {Object} customer Customer Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "due_date" : "2016-01-21T23:06:00.055Z",
 *    "amount" : 1000,
 *    "policy_number": "A0E9E13C3A03157DD9EAE3E9",
 *    "status": "paid",
 *    "customer": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 *
 */
router.delete('/:id', accessControl(['agent', 'provider', 'admin']), billController.delete);

// Expose Bill Billr
module.exports = router;
