'use strict';
/**
 * Provider Router
 */

/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:provider-router');

const providerController  = require('../controllers/provider');
const accessControl       = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {get} /providers/:id Get Provider
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Provider
 *
 * @apiDescription Get a provider with the given id
 *
 * @apiSuccess {String} _id provider id
 * @apiSuccess {String} company_name Provider's Company name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Array} products Insurance products offered by the Provider
 * @apiSuccess {Object} user User Data object
 * @apiSuccess {Object} address Provider address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "company_name": "CBD Insurance Company LTD",
 *    "email": "provider@company.com",
 *    "products": [{
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      ...
 *    ],
 *    user: {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "address": {
 *      "street": "Old Tree, Phase 1, New Estate",
 *      "locality_name": "south sea",
 *      "country": "Kenya",
 *      "city": "Nairobi",
 *      "location": {
 *        "lat": 0.09013,
 *        "long": 12.3562100
 *      }
 *    },
 *  }
 *
 */
router.get('/:id', accessControl(['agent', 'admin', 'provider']), providerController.fetchOne);

/**
 * @api {put} /providers/:id Update Provider
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Provider
 *
 * @apiDescription Update a provider with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request Example:
 * {
 *    "email": "info@provider_company.com"
 * }
 *
 * @apiSuccess {String} _id provider id
 * @apiSuccess {String} company_name Provider's Company name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Array} products Insurance products offered by the Provider
 * @apiSuccess {Object} user User Data object
 * @apiSuccess {Object} address Provider address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "company_name": "CBD Insurance Company LTD",
 *    "email": "provider@company.com",
 *    "products": [{
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      ...
 *    ],
 *    user: {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "address": {
 *      "street": "Old Tree, Phase 1, New Estate",
 *      "locality_name": "south sea",
 *      "country": "Kenya",
 *      "city": "Nairobi",
 *      "location": {
 *        "lat": 0.09013,
 *        "long": 12.3562100
 *      }
 *    },
 *  }
 *
 */
router.put('/:id', accessControl(['provider', 'admin']), providerController.update);

/**
 * @api {get} /providers/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get providers collection
 * @apiVersion 1.0.0
 * @apiName FetchAllByPagination
 * @apiGroup Provider
 *
 * @apiDescription Get a collection of providers. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id provider id
 * @apiSuccess {String} company_name Provider's Company name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Array} products Insurance products offered by the Provider
 * @apiSuccess {Object} user User Data object
 * @apiSuccess {Object} address Provider address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      "_id" : "556e1174a8952c9521286a60",
 *      "company_name": "CBD Insurance Company LTD",
 *      "email": "provider@company.com",
 *      "products": [{
 *          "_id" : "556e1174a8952c9521286a60",
 *          ...
 *        },
 *        ...
 *      ],
 *      user: {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      "address": {
 *        "street": "Old Tree, Phase 1, New Estate",
 *        "locality_name": "south sea",
 *        "country": "Kenya",
 *        "city": "Nairobi",
 *        "location": {
 *          "lat": 0.09013,
 *          "long": 12.3562100
 *        }
 *      }
 *    }]
 *  }
 *
 */
router.get('/paginate', accessControl(['admin', 'provider', 'agent']), providerController.fetchAllByPagination);

/**
 * @api {get} /providers/all Get providers collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup Provider
 *
 * @apiDescription Get a collection of providers.
 *
 * @apiSuccess {String} _id provider id
 * @apiSuccess {String} company_name Provider's Company name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Array} products Insurance products offered by the Provider
 * @apiSuccess {Object} user User Data object
 * @apiSuccess {Object} address Provider address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 *
 * @apiSuccessExample Response Example:
 *  [{
 *    "_id" : "556e1174a8952c9521286a60",
 *    "company_name": "CBD Insurance Company LTD",
 *    "email": "provider@company.com",
 *    "products": [{
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      ...
 *    ],
 *    user: {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "address": {
 *      "street": "Old Tree, Phase 1, New Estate",
 *      "locality_name": "south sea",
 *      "country": "Kenya",
 *      "city": "Nairobi",
 *      "location": {
 *        "lat": 0.09013,
 *        "long": 12.3562100
 *      }
 *    },
 *  }]
 *
 */
router.get('/all', accessControl(['admin', 'provider', 'agent']), providerController.fetchAll);

/**
 * @api {delete} /providers/:id Delete Provider
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Provider
 *
 * @apiDescription Delete a provider with the given id
 *
 * @apiSuccess {String} _id provider id
 * @apiSuccess {String} company_name Provider's Company name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Array} products Insurance products offered by the Provider
 * @apiSuccess {Object} user User Data object
 * @apiSuccess {Object} address Provider address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "company_name": "CBD Insurance Company LTD",
 *    "email": "provider@company.com",
 *    "products": [{
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      ...
 *    ],
 *    user: {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "address": {
 *      "street": "Old Tree, Phase 1, New Estate",
 *      "locality_name": "south sea",
 *      "country": "Kenya",
 *      "city": "Nairobi",
 *      "location": {
 *        "lat": 0.09013,
 *        "long": 12.3562100
 *      }
 *    },
 *  }
 *
 */
router.delete('/:id', accessControl(['provider', 'admin']), providerController.delete);

// Expose Provider Providerr
module.exports = router;

