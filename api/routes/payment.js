'use strict';
/**
 * Payment Router
 */

/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:payment-router');

const paymentController     = require('../controllers/payment');
const accessControl       = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {post} /payments/create Create a payment
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Payment
 *
 * @apiDescription Create a new payment.
 *
 * @apiParam {Number} amount Payment Amount
 * @apiParam {String} payment_mode Payment Mode
 * @apiParam {String} status Payment status, which is either __failed__, __cancelled__ or __completed__
 * @apiParam {String} bill Referenced Bill ID
 *
 * @apiParamExample Request Example:
 *  {
 *    "bill" : "556e1174a8952c9521286a60",
 *    "payment_mode": "Credit Card",
 *    "status": "completed",
 *    "amount" : 1000
 *  }
 *
 * @apiSuccess {String} _id payment id
 * @apiSuccess {Number} amount Payment Amount
 * @apiSuccess {String} payment_mode Payment Mode
 * @apiSuccess {String} status Payment status, which is either __failed__, __cancelled__ or __completed__
 * @apiSuccess {String} bill Referenced Bill Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "payment_mode": "Credit Card",
 *    "status": "completed",
 *    "amount" : 1000
 *    "bill": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 */
router.post('/create', accessControl(['admin', 'agent', 'provider']), paymentController.create);

/**
 * @api {get} /payments/:id Get Payment
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Payment
 *
 * @apiDescription Get a payment with the given id
 *
 * @apiSuccess {String} _id payment id
 * @apiSuccess {Number} amount Payment Amount
 * @apiSuccess {String} payment_mode Payment Mode
 * @apiSuccess {String} status Payment status, which is either __failed__, __cancelled__ or __completed__
 * @apiSuccess {String} bill Referenced Bill Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "payment_mode": "Credit Card",
 *    "status": "completed",
 *    "amount" : 1000
 *    "bill": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 */
router.get('/:id', accessControl(['payment', 'admin', 'provider']), paymentController.fetchOne);

/**
 * @api {put} /payments/:id Update Payment
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Payment
 *
 * @apiDescription Update a payment with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request Example:
 * {
 *
 * }
 *
 * @apiSuccess {String} _id payment id
 * @apiSuccess {Number} amount Payment Amount
 * @apiSuccess {String} payment_mode Payment Mode
 * @apiSuccess {String} status Payment status, which is either __failed__, __cancelled__ or __completed__
 * @apiSuccess {String} bill Referenced Bill Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "payment_mode": "Credit Card",
 *    "status": "completed",
 *    "amount" : 1000
 *    "bill": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 */
router.put('/:id', accessControl(['provider', 'payment', 'admin']), paymentController.update);

/**
 * @api {get} /payments/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get payments collection
 * @apiVersion 1.0.0
 * @apiName FetchAllByPagination
 * @apiGroup Payment
 *
 * @apiDescription Get a collection of payments. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id payment id
 * @apiSuccess {Number} amount Payment Amount
 * @apiSuccess {String} payment_mode Payment Mode
 * @apiSuccess {String} status Payment status, which is either __failed__, __cancelled__ or __completed__
 * @apiSuccess {String} bill Referenced Bill Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      "_id" : "556e1174a8952c9521286a60"
 *      "payment_mode": "Credit Card",
 *      "status": "completed",
 *      "amount" : 1000
 *      "bill": {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      }
 *    }]
 *  }
 *
 */
router.get('/paginate', accessControl(['admin', 'provider', 'agent']), paymentController.fetchAllByPagination);

/**
 * @api {get} /payments/all Get payments collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup Payment
 *
 * @apiDescription Get a collection of payments.
 *
 * @apiSuccess {String} _id payment id
 * @apiSuccess {Number} amount Payment Amount
 * @apiSuccess {String} payment_mode Payment Mode
 * @apiSuccess {String} status Payment status, which is either __failed__, __cancelled__ or __completed__
 * @apiSuccess {String} bill Referenced Bill Data
 *
 * @apiSuccessExample Response Example:
 *  [{
 *    "_id" : "556e1174a8952c9521286a60"
 *    "payment_mode": "Credit Card",
 *    "status": "completed",
 *    "amount" : 1000
 *    "bill": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }]
 *
 */
router.get('/all', accessControl(['admin', 'provider', 'agent']), paymentController.fetchAll);

/**
 * @api {delete} /payments/:id Delete Payment
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Payment
 *
 * @apiDescription Delete a payment with the given id
 *
 * @apiSuccess {String} _id payment id
 * @apiSuccess {Number} amount Payment Amount
 * @apiSuccess {String} payment_mode Payment Mode
 * @apiSuccess {String} status Payment status, which is either __failed__, __cancelled__ or __completed__
 * @apiSuccess {String} bill Referenced Bill Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "payment_mode": "Credit Card",
 *    "status": "completed",
 *    "amount" : 1000
 *    "bill": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 */
router.delete('/:id', accessControl(['agent', 'provider', 'admin']), paymentController.delete);

// Expose Payment Paymentr
module.exports = router;

