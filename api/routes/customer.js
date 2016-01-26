'use strict';
/**
 * Customer Router
 */

/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:customer-router');

const customerController     = require('../controllers/customer');
const accessControl          = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {get} /customers/:id Get Customer
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Customer
 *
 * @apiDescription Get a customer with the given id
 *
 * @apiSuccess {String} _id customer id
 * @apiSuccess {Object} address Address Information
 * @apiSuccess {String} address.street Street Name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Object} person_details Person details __Applies if type is "customer"__
 * @apiSuccess {String} person_details.first_name First Name
 * @apiSuccess {String} person_details.last_name Last Name
 * @apiSuccess {String} person_details.gender Gender
 * @apiSuccess {String} person_details.date_of_birth Date of birth in ISO format(UTC)
 * @apiSuccess {Object} organisation_details Organisation details __Applies if type is "organisation"__
 * @apiSuccess {String} organisation_details.name Name of the organisation
 * @apiSuccess {String} organisation_details.business_nature Nature of business
 * @apiSuccess {Number} organisation_details.employee_count Employee count
 * @apiSuccess {String} type Customer type either __customer__ or __organisation__
 * @apiSuccess {Object} user Corresponding User Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "address": {
 *      "street": "Street Name",
 *      "locality_name": "Locality name",
 *      "country": "Kenya",
 *      "city": "Nairobi"
 *    },
 *    "type": "customer",
 *    "email" : "customer@email.com",
 *    // Applies if type is "customer"
 *    "person_details": {
 *      "first_name": "John Doe",
 *      "last_name": "Smith",
 *      "gender": "Male",
 *      "date_of_birth": "1980-01-22T00:45:45.811Z"
 *    },
 *    // Applies if type is "organisation"
 *    "organisation_details": {
 *      "name": "Organisation name",
 *      "business_nature": "Pharmacy",
 *      "employee_count": 5
 *    },
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 */
router.get('/:id', accessControl(['*']), customerController.fetchOne);

/**
 * @api {put} /customers/:id Update Customer
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Customer
 *
 * @apiDescription Update a customer with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request Example:
 * {
 *
 * }
 *
 * @apiSuccess {String} _id customer id
 * @apiSuccess {Object} address Address Information
 * @apiSuccess {String} address.street Street Name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Object} person_details Person details __Applies if type is "customer"__
 * @apiSuccess {String} person_details.first_name First Name
 * @apiSuccess {String} person_details.last_name Last Name
 * @apiSuccess {String} person_details.gender Gender
 * @apiSuccess {String} person_details.date_of_birth Date of birth in ISO format(UTC)
 * @apiSuccess {Object} organisation_details Organisation details __Applies if type is "organisation"__
 * @apiSuccess {String} organisation_details.name Name of the organisation
 * @apiSuccess {String} organisation_details.business_nature Nature of business
 * @apiSuccess {Number} organisation_details.employee_count Employee count
 * @apiSuccess {String} type Customer type either __customer__ or __organisation__
 * @apiSuccess {Object} user Corresponding User Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "address": {
 *      "street": "Street Name",
 *      "locality_name": "Locality name",
 *      "country": "Kenya",
 *      "city": "Nairobi"
 *    },
 *    "type": "customer",
 *    "email" : "customer@email.com",
 *    // Applies if type is "customer"
 *    "person_details": {
 *      "first_name": "John Doe",
 *      "last_name": "Smith",
 *      "gender": "Male",
 *      "date_of_birth": "1980-01-22T00:45:45.811Z"
 *    },
 *    // Applies if type is "organisation"
 *    "organisation_details": {
 *      "name": "Organisation name",
 *      "business_nature": "Pharmacy",
 *      "employee_count": 5
 *    },
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 */
router.put('/:id', accessControl(['*']), customerController.update);

/**
 * @api {get} /customers/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get customers collection
 * @apiVersion 1.0.0
 * @apiName FetchAllByPagination
 * @apiGroup Customer
 *
 * @apiDescription Get a collection of customers. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id customer id
 * @apiSuccess {Object} address Address Information
 * @apiSuccess {String} address.street Street Name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Object} person_details Person details __Applies if type is "customer"__
 * @apiSuccess {String} person_details.first_name First Name
 * @apiSuccess {String} person_details.last_name Last Name
 * @apiSuccess {String} person_details.gender Gender
 * @apiSuccess {String} person_details.date_of_birth Date of birth in ISO format(UTC)
 * @apiSuccess {Object} organisation_details Organisation details __Applies if type is "organisation"__
 * @apiSuccess {String} organisation_details.name Name of the organisation
 * @apiSuccess {String} organisation_details.business_nature Nature of business
 * @apiSuccess {Number} organisation_details.employee_count Employee count
 * @apiSuccess {String} type Customer type either __customer__ or __organisation__
 * @apiSuccess {Object} user Corresponding User Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *
 *    "_id" : "556e1174a8952c9521286a60",
 *    "address": {
 *      "street": "Street Name",
 *      "locality_name": "Locality name",
 *      "country": "Kenya",
 *      "city": "Nairobi"
 *    },
 *    "type": "customer",
 *    "email" : "customer@email.com",
 *    // Applies if type is "customer"
 *    "person_details": {
 *      "first_name": "John Doe",
 *      "last_name": "Smith",
 *      "gender": "Male",
 *      "date_of_birth": "1980-01-22T00:45:45.811Z"
 *    },
 *    // Applies if type is "organisation"
 *    "organisation_details": {
 *      "name": "Organisation name",
 *      "business_nature": "Pharmacy",
 *      "employee_count": 5
 *    },
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *    }]
 *  }
 *
 */
router.get('/paginate', accessControl(['admin', 'provider', 'agent']), customerController.fetchAllByPagination);

/**
 * @api {get} /customers/all Get customers collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup Customer
 *
 * @apiDescription Get a collection of customers.
 *
 * @apiSuccess {String} _id customer id
 * @apiSuccess {Object} address Address Information
 * @apiSuccess {String} address.street Street Name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Object} person_details Person details __Applies if type is "customer"__
 * @apiSuccess {String} person_details.first_name First Name
 * @apiSuccess {String} person_details.last_name Last Name
 * @apiSuccess {String} person_details.gender Gender
 * @apiSuccess {String} person_details.date_of_birth Date of birth in ISO format(UTC)
 * @apiSuccess {Object} organisation_details Organisation details __Applies if type is "organisation"__
 * @apiSuccess {String} organisation_details.name Name of the organisation
 * @apiSuccess {String} organisation_details.business_nature Nature of business
 * @apiSuccess {Number} organisation_details.employee_count Employee count
 * @apiSuccess {String} type Customer type either __customer__ or __organisation__
 * @apiSuccess {Object} user Corresponding User Data
 *
 * @apiSuccessExample Response Example:
 *  [{
 *    "_id" : "556e1174a8952c9521286a60",
 *    "address": {
 *      "street": "Street Name",
 *      "locality_name": "Locality name",
 *      "country": "Kenya",
 *      "city": "Nairobi"
 *    },
 *    "type": "customer",
 *    "email" : "customer@email.com",
 *    // Applies if type is "customer"
 *    "person_details": {
 *      "first_name": "John Doe",
 *      "last_name": "Smith",
 *      "gender": "Male",
 *      "date_of_birth": "1980-01-22T00:45:45.811Z"
 *    },
 *    // Applies if type is "organisation"
 *    "organisation_details": {
 *      "name": "Organisation name",
 *      "business_nature": "Pharmacy",
 *      "employee_count": 5
 *    },
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }]
 */
router.get('/all', accessControl(['admin', 'provider', 'agent']), customerController.fetchAll);

/**
 * @api {delete} /customers/:id Delete Customer
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Customer
 *
 * @apiDescription Delete a customer with the given id
 *
 * @apiSuccess {String} _id customer id
 * @apiSuccess {Object} address Address Information
 * @apiSuccess {String} address.street Street Name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Object} person_details Person details __Applies if type is "customer"__
 * @apiSuccess {String} person_details.first_name First Name
 * @apiSuccess {String} person_details.last_name Last Name
 * @apiSuccess {String} person_details.gender Gender
 * @apiSuccess {String} person_details.date_of_birth Date of birth in ISO format(UTC)
 * @apiSuccess {Object} organisation_details Organisation details __Applies if type is "organisation"__
 * @apiSuccess {String} organisation_details.name Name of the organisation
 * @apiSuccess {String} organisation_details.business_nature Nature of business
 * @apiSuccess {Number} organisation_details.employee_count Employee count
 * @apiSuccess {String} type Customer type either __customer__ or __organisation__
 * @apiSuccess {Object} user Corresponding User Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "address": {
 *      "street": "Street Name",
 *      "locality_name": "Locality name",
 *      "country": "Kenya",
 *      "city": "Nairobi"
 *    },
 *    "type": "customer",
 *    "email" : "customer@email.com",
 *    // Applies if type is "customer"
 *    "person_details": {
 *      "first_name": "John Doe",
 *      "last_name": "Smith",
 *      "gender": "Male",
 *      "date_of_birth": "1980-01-22T00:45:45.811Z"
 *    },
 *    // Applies if type is "organisation"
 *    "organisation_details": {
 *      "name": "Organisation name",
 *      "business_nature": "Pharmacy",
 *      "employee_count": 5
 *    },
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 */
router.delete('/:id', accessControl(['*']), customerController.delete);

// Expose Customer Customerr
module.exports = router;


