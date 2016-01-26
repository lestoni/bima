'use strict';
/**
 * Policy Router
 */

/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:policy-router');

const policyController     = require('../controllers/policy');
const accessControl       = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {post} /policies/create Create a policy
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Policy
 *
 * @apiDescription Create a new policy.
 *
 * @apiParam {String} customer ID of the customer purchasing the policy
 * @apiParam {String} provider ID of the Policy Provider
 * @apiParam {String} product  ID of the Insurance product type
 * @apiParam {String} policy_number Policy Number
 * @apiParam {String} status Status of the policy either __dormant__, __active__ or __cancelled__
 * @apiParam {Number} premium_amount Premium Amount
 * @apiParam {Array} mode_of_payment Accepted/Agreed Mode of payment
 * @apiParam {String} subscription_start_date Subscription start date in ISO format(UTC)
 * @apiParam {String} renewal_date Renewal date in ISO format(UTC)
 *
 * @apiParamExample Request Example:
 *  {
 *    "customer" : "356e1174a8952c9521286a60",
 *    "provider" : "1156e1174a8952c9521286a60",
 *    "product" : "6e1174a8952c9521286a60e31",
 *    "policy_number": "2847D12181AD043D6F400DEE",
 *    "status": "dormant",
 *    "premium_amount": 6500,
 *    "mode_of_payment": ["Visa", "MasterCard"],
 *    "subscription_start_date": "2015-01-22T08:19:17.557Z",
 *    "renewal_date": "2020-01-22T08:19:17.557Z"
 *  }
 *
 * @apiSuccess {String} _id policy id
 * @apiSuccess {String} customer Data of the customer purchasing the policy
 * @apiSuccess {String} provider Data of the Policy Provider
 * @apiSuccess {String} product  Data of the Insurance product type
 * @apiSuccess {String} policy_number Policy Number
 * @apiSuccess {String} status Status of the policy either __dormant__, __active__ or __cancelled__
 * @apiSuccess {Number} premium_amount Premium Amount
 * @apiSuccess {Array} mode_of_payment Accepted/Agreed Mode of payment
 * @apiSuccess {String} subscription_start_date Subscription start date in ISO format(UTC)
 * @apiSuccess {String} renewal_date Renewal date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "customer" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "provider" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "product" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy_number": "2847D12181AD043D6F400DEE",
 *    "status": "dormant",
 *    "premium_amount": 6500,
 *    "mode_of_payment": ["Visa", "MasterCard"],
 *    "subscription_start_date": "2015-01-22T08:19:17.557Z",
 *    "renewal_date": "2020-01-22T08:19:17.557Z"
 *  }
 *
 */
router.post('/create', accessControl(['admin', 'agent', 'provider']), policyController.create);

/**
 * @api {get} /policies/:id Get Policy
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Policy
 *
 * @apiDescription Get a policy with the given id
 *
 * @apiSuccess {String} _id policy id
 * @apiSuccess {String} customer Data of the customer purchasing the policy
 * @apiSuccess {String} provider Data of the Policy Provider
 * @apiSuccess {String} product  Data of the Insurance product type
 * @apiSuccess {String} policy_number Policy Number
 * @apiSuccess {String} status Status of the policy either __dormant__, __active__ or __cancelled__
 * @apiSuccess {Number} premium_amount Premium Amount
 * @apiSuccess {Array} mode_of_payment Accepted/Agreed Mode of payment
 * @apiSuccess {String} subscription_start_date Subscription start date in ISO format(UTC)
 * @apiSuccess {String} renewal_date Renewal date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "customer" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "provider" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "product" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy_number": "2847D12181AD043D6F400DEE",
 *    "status": "dormant",
 *    "premium_amount": 6500,
 *    "mode_of_payment": ["Visa", "MasterCard"],
 *    "subscription_start_date": "2015-01-22T08:19:17.557Z",
 *    "renewal_date": "2020-01-22T08:19:17.557Z"
 *  }
 */
router.get('/:id', accessControl(['agent', 'admin', 'provider']), policyController.fetchOne);

/**
 * @api {put} /policies/:id Update Policy
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Policy
 *
 * @apiDescription Update a policy with the given id
 *
 * @apiParam {Object} Update_Type Update data
 *
 * @apiParamExample Request Example:
 * {
 *    "status": "active"
 * }
 *
 * @apiSuccess {String} _id policy id
 * @apiSuccess {String} customer Data of the customer purchasing the policy
 * @apiSuccess {String} provider Data of the Policy Provider
 * @apiSuccess {String} product  Data of the Insurance product type
 * @apiSuccess {String} policy_number Policy Number
 * @apiSuccess {String} status Status of the policy either __dormant__, __active__ or __cancelled__
 * @apiSuccess {Number} premium_amount Premium Amount
 * @apiSuccess {Array} mode_of_payment Accepted/Agreed Mode of payment
 * @apiSuccess {String} subscription_start_date Subscription start date in ISO format(UTC)
 * @apiSuccess {String} renewal_date Renewal date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "customer" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "provider" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "product" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy_number": "2847D12181AD043D6F400DEE",
 *    "status": "dormant",
 *    "premium_amount": 6500,
 *    "mode_of_payment": ["Visa", "MasterCard"],
 *    "subscription_start_date": "2015-01-22T08:19:17.557Z",
 *    "renewal_date": "2020-01-22T08:19:17.557Z"
 *  }
 *
 */
router.put('/:id', accessControl(['provider', 'agent', 'admin']), policyController.update);

/**
 * @api {get} /policies/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get policies collection
 * @apiVersion 1.0.0
 * @apiName FetchAllByPagination
 * @apiGroup Policy
 *
 * @apiDescription Get a collection of policies. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id policy id
 * @apiSuccess {String} customer Data of the customer purchasing the policy
 * @apiSuccess {String} provider Data of the Policy Provider
 * @apiSuccess {String} product  Data of the Insurance product type
 * @apiSuccess {String} policy_number Policy Number
 * @apiSuccess {String} status Status of the policy either __dormant__, __active__ or __cancelled__
 * @apiSuccess {Number} premium_amount Premium Amount
 * @apiSuccess {Array} mode_of_payment Accepted/Agreed Mode of payment
 * @apiSuccess {String} subscription_start_date Subscription start date in ISO format(UTC)
 * @apiSuccess {String} renewal_date Renewal date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      "_id" : "556e1174a8952c9521286a60",
 *      "customer" : {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      "provider" : {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      "product" : {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      "policy_number": "2847D12181AD043D6F400DEE",
 *      "status": "dormant",
 *      "premium_amount": 6500,
 *      "mode_of_payment": ["Visa", "MasterCard"],
 *      "subscription_start_date": "2015-01-22T08:19:17.557Z",
 *      "renewal_date": "2020-01-22T08:19:17.557Z"
 *    }]
 *  }
 *
 */
router.get('/paginate', accessControl(['admin', 'provider', 'agent']), policyController.fetchAllByPagination);

/**
 * @api {get} /policies/all Get policies collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup Policy
 *
 * @apiDescription Get a collection of policies.
 *
 * @apiSuccess {String} _id policy id
 * @apiSuccess {String} customer Data of the customer purchasing the policy
 * @apiSuccess {String} provider Data of the Policy Provider
 * @apiSuccess {String} product  Data of the Insurance product type
 * @apiSuccess {String} policy_number Policy Number
 * @apiSuccess {String} status Status of the policy either __dormant__, __active__ or __cancelled__
 * @apiSuccess {Number} premium_amount Premium Amount
 * @apiSuccess {Array} mode_of_payment Accepted/Agreed Mode of payment
 * @apiSuccess {String} subscription_start_date Subscription start date in ISO format(UTC)
 * @apiSuccess {String} renewal_date Renewal date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  [{
 *    "_id" : "556e1174a8952c9521286a60",
 *    "customer" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "provider" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "product" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy_number": "2847D12181AD043D6F400DEE",
 *    "status": "dormant",
 *    "premium_amount": 6500,
 *    "mode_of_payment": ["Visa", "MasterCard"],
 *    "subscription_start_date": "2015-01-22T08:19:17.557Z",
 *    "renewal_date": "2020-01-22T08:19:17.557Z"
 *  }]
 *
 */
router.get('/all', accessControl(['admin', 'provider', 'agent']), policyController.fetchAll);

/**
 * @api {delete} /policies/:id Delete Policy
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Policy
 *
 * @apiDescription Delete a policy with the given id
 *
 * @apiSuccess {String} _id policy id
 * @apiSuccess {String} customer Data of the customer purchasing the policy
 * @apiSuccess {String} provider Data of the Policy Provider
 * @apiSuccess {String} product  Data of the Insurance product type
 * @apiSuccess {String} policy_number Policy Number
 * @apiSuccess {String} status Status of the policy either __dormant__, __active__ or __cancelled__
 * @apiSuccess {Number} premium_amount Premium Amount
 * @apiSuccess {Array} mode_of_payment Accepted/Agreed Mode of payment
 * @apiSuccess {String} subscription_start_date Subscription start date in ISO format(UTC)
 * @apiSuccess {String} renewal_date Renewal date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "customer" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "provider" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "product" : {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "policy_number": "2847D12181AD043D6F400DEE",
 *    "status": "dormant",
 *    "premium_amount": 6500,
 *    "mode_of_payment": ["Visa", "MasterCard"],
 *    "subscription_start_date": "2015-01-22T08:19:17.557Z",
 *    "renewal_date": "2020-01-22T08:19:17.557Z"
 *  }
 */
router.delete('/:id', accessControl(['agent', 'provider', 'admin']), policyController.delete);

// Expose Policy Policyr
module.exports = router;
