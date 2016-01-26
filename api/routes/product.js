'use strict';
/**
 * Product Router
 */

/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:product-router');

const productController     = require('../controllers/product');
const accessControl       = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {post} /products/create Create a product
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Product
 *
 * @apiDescription Create a new product.
 *
 * @apiParam {String} name Name of the Insurance product
 * @apiParam {String} description Description of the Insurance product
 * @apiParam {Array} premiums Premium amounts
 *
 * @apiParamExample Request Example:
 *  {
 *    "name" : "Health Insurance",
 *    "description": "Health insurance cover",
 *    "premiums": ["2300", "6700"]
 *  }
 *
 * @apiSuccess {String} _id product id
 * @apiSuccess {String} name Name of the Insurance product
 * @apiSuccess {String} description Description of the Insurance product
 * @apiSuccess {Array} premiums Premium amounts
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "name" : "Health Insurance",
 *    "description": "Health insurance cover",
 *    "premiums": ["2300", "6700"]
 *  }
 *
 */
router.post('/create', accessControl(['admin', 'provider']), productController.create);

/**
 * @api {get} /products/:id Get Product
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Product
 *
 * @apiDescription Get a product with the given id
 *
 * @apiSuccess {String} _id product id
 * @apiSuccess {String} name Name of the Insurance product
 * @apiSuccess {String} description Description of the Insurance product
 * @apiSuccess {Array} premiums Premium amounts
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "name" : "Health Insurance",
 *    "description": "Health insurance cover",
 *    "premiums": ["2300", "6700"]
 *  }
 *
 */
router.get('/:id', accessControl(['agent', 'admin', 'provider']), productController.fetchOne);

/**
 * @api {put} /products/:id Update Product
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Product
 *
 * @apiDescription Update a product with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request Example:
 * {
 *    "description": "Health and life insurance"
 * }
 *
 * @apiSuccess {String} _id product id
 * @apiSuccess {String} name Name of the Insurance product
 * @apiSuccess {String} description Description of the Insurance product
 * @apiSuccess {Array} premiums Premium amounts
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "name" : "Health Insurance",
 *    "description": "Health insurance cover",
 *    "premiums": ["2300", "6700"]
 *  }
 *
 */
router.put('/:id', accessControl(['provider', 'admin']), productController.update);

/**
 * @api {get} /products/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get products collection
 * @apiVersion 1.0.0
 * @apiName FetchAllByPagination
 * @apiGroup Product
 *
 * @apiDescription Get a collection of products. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id product id
 * @apiSuccess {String} name Name of the Insurance product
 * @apiSuccess {String} description Description of the Insurance product
 * @apiSuccess {Array} premiums Premium amounts
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      "_id" : "556e1174a8952c9521286a60",
 *      "name" : "Health Insurance",
 *      "description": "Health insurance cover",
 *      "premiums": ["2300", "6700"]
 *    }]
 *  }
 *
 */
router.get('/paginate', accessControl(['admin', 'provider', 'agent']), productController.fetchAllByPagination);

/**
 * @api {get} /products/all Get products collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup Product
 *
 * @apiDescription Get a collection of products.
 *
 * @apiSuccess {String} _id product id
 * @apiSuccess {String} name Name of the Insurance product
 * @apiSuccess {String} description Description of the Insurance product
 * @apiSuccess {Array} premiums Premium amounts
 *
 * @apiSuccessExample Response Example:
 *  [{
 *    "_id" : "556e1174a8952c9521286a60",
 *    "name" : "Health Insurance",
 *    "description": "Health insurance cover",
 *    "premiums": ["2300", "6700"]
 *  }]
 */
router.get('/all', accessControl(['admin', 'provider', 'agent']), productController.fetchAll);

/**
 * @api {delete} /products/:id Delete Product
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Product
 *
 * @apiDescription Delete a product with the given id
 *
 * @apiSuccess {String} _id product id
 * @apiSuccess {String} name Name of the Insurance product
 * @apiSuccess {String} description Description of the Insurance product
 * @apiSuccess {Array} premiums Premium amounts
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "name" : "Health Insurance",
 *    "description": "Health insurance cover",
 *    "premiums": ["2300", "6700"]
 *  }
 *
 */
router.delete('/:id', accessControl(['provider', 'admin']), productController.delete);

// Expose Product Productr
module.exports = router;
