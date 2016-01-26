'use strict';
/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:user-router');

const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const accessControl  = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {post} /users/signup Create a user
 * @apiVersion 1.0.0
 * @apiName Signup
 * @apiGroup User
 *
 * @apiDescription Create a new user
 *
 * @apiParam {String} password Password
 * @apiParam {String} phone_number Phone number
 * @apiParam {String} role Role of the new user either of these: __provider__, __organisation__ or __consumer__
 *
 * @apiParamExample Request Example:
 *  {
 *    "password": "pin",
 *    "phone_number: "4546126515741",
 *    "role": "consumer"
 *  }
 *
 * @apiSuccess {String} _id user id
 * @apiSuccess {String} password Password
 * @apiSuccess {String} phone_number Phone number
 * @apiSuccess {String} role Role of the new user
 * @apiSuccess {Object} RoleType Data of the role type ie __provider__, or __consumer__
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "phone_number: "4546126515741",
 *    "role": "consumer",
 *    "consumer": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 */
router.post('/signup', userController.create);

/**
 * @api {post} /users/login Login a user
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup User
 *
 * @apiDescription Log in a user. The request returns a token used to authentication
 * of the user on subsequent requests. The token is placed as an HTTP header ie
 * ```Authorization: Bearer <Token-here>``` otherwise requests are rejected.
 *
 * @apiParam {String} password Password
 * @apiParam {String} identifier Email or Phone number of the user
 *
 * @apiParamExample Request Example:
 *  {
 *    "password": "password",
 *    "identifier": "254711223344"
 *  }
 *
 * @apiSuccess {String} token auth token
 * @apiSuccess {Object} user user info
 * @apiSuccess {String} user._id user id
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "token" : "ylHUMaVrS0dpcO/+nT+6aAVVGcRJzu=",
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *
 *    }
 *  }
 *
 */
router.post('/login', authController.login);

/**
 * @api {post} /users/logout Logout a user
 * @apiVersion 1.0.0
 * @apiName Logout
 * @apiGroup User
 *
 * @apiDescription Invalidate a users token
 *
 * @apiSuccess {Boolean} logged_out message
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "logged_out" : true
 *  }
 *
 */
router.post('/logout', authController.logout);


/**
 * @api {get} /users/:id Get User
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup User
 *
 * @apiDescription Get a user with the given id
 *
 * @apiSuccess {String} _id user id
 * @apiSuccess {String} phone_number Phone number
 * @apiSuccess {String} role User Role
 * @apiSuccess {String} last_modified Last Modification date in ISO format(UTC)
 * @apiSuccess {String} date_created  Creation date in ISO format(UTC)
 * @apiSuccess {String} last_login Last login date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "last_modified": "2016-01-21T20:36:48.878Z",
 *    "date_created": "2016-01-21T20:18:07.142Z",
 *    "phone_number": "254713510521",
 *    "last_login": "2016-01-21T20:36:48.874Z",
 *    "role": "consumer"
 *  }
 */
router.get('/:id', accessControl(['*']), userController.fetchOne);

/**
 * @api {put} /users/:id Update User
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup User
 *
 * @apiDescription Update a user with the given id
 *
 * @apiSuccess {String} _id user id
 * @apiSuccess {String} phone_number Phone number
 * @apiSuccess {String} role User Role
 * @apiSuccess {String} last_modified Last Modification date in ISO format(UTC)
 * @apiSuccess {String} date_created  Creation date in ISO format(UTC)
 * @apiSuccess {String} last_login Last login date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60",
 *    "last_modified": "2016-01-21T20:36:48.878Z",
 *    "date_created": "2016-01-21T20:18:07.142Z",
 *    "phone_number": "254713510521",
 *    "last_login": "2016-01-21T20:36:48.874Z",
 *    "role": "consumer"
 *  }
 */
router.put('/:id', accessControl(['*']), userController.update);

/**
 * @api {get} /users/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get users collection
 * @apiVersion 1.0.0
 * @apiName FetchPaginated
 * @apiGroup User
 *
 * @apiDescription Get a collection of users. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id user id
 * @apiSuccess {String} phone_number Phone number
 * @apiSuccess {String} role User Role
 * @apiSuccess {String} last_modified Last Modification date in ISO format(UTC)
 * @apiSuccess {String} date_created  Creation date in ISO format(UTC)
 * @apiSuccess {String} last_login Last login date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      "_id" : "556e1174a8952c9521286a60",
 *      "last_modified": "2016-01-21T20:36:48.878Z",
 *      "date_created": "2016-01-21T20:18:07.142Z",
 *      "phone_number": "254713510521",
 *      "last_login": "2016-01-21T20:36:48.874Z",
 *      "role": "consumer"
 *    }]
 *  }
 */
router.get('/', accessControl(['admin']), userController.fetchAllByPagination);

/**
 * @api {get} /users Get users collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup User
 *
 * @apiDescription Get a collection of users.
 *
 * @apiSuccess {String} _id user id
 * @apiSuccess {String} phone_number Phone number
 * @apiSuccess {String} role User Role
 * @apiSuccess {String} last_modified Last Modification date in ISO format(UTC)
 * @apiSuccess {String} date_created  Creation date in ISO format(UTC)
 * @apiSuccess {String} last_login Last login date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  [{
 *      "_id" : "556e1174a8952c9521286a60",
 *    "last_modified": "2016-01-21T20:36:48.878Z",
 *    "date_created": "2016-01-21T20:18:07.142Z",
 *    "phone_number": "254713510521",
 *    "last_login": "2016-01-21T20:36:48.874Z",
 *    "role": "consumer"
 *  }]
 */
router.get('/', accessControl(['admin']), userController.fetchAll);

/**
 * @api {delete} /users/:id Delete User
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup User
 *
 * @apiDescription Delete a user with the given id
 *
 * @apiSuccess {String} _id user id
 * @apiSuccess {String} phone_number Phone number
 * @apiSuccess {String} role User Role
 * @apiSuccess {String} last_modified Last Modification date in ISO format(UTC)
 * @apiSuccess {String} date_created  Creation date in ISO format(UTC)
 * @apiSuccess {String} last_login Last login date in ISO format(UTC)
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "last_modified": "2016-01-21T20:36:48.878Z",
 *    "date_created": "2016-01-21T20:18:07.142Z",
 *    "phone_number": "254713510521",
 *    "last_login": "2016-01-21T20:36:48.874Z",
 *    "role": "consumer"
 *  }
 *
 */
router.delete('/:id', accessControl(['*']), userController.delete);

/**
 * @api {put} /users/password/update Update user password/pin
 * @apiVersion 1.0.0
 * @apiName UpdatePassword
 * @apiGroup User
 *
 * @apiDescription Update password of a given user.
 *
 * @apiParam {String} new_password New password
 * @apiParam {String} old_password Old password
 *
 * @apiParamExample Request Example:
 * {
 *    "new_password": "2654",
 *    "old_password": "1881468"
 * }
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "updated": true
 *  }
 */
router.post('/password/update', accessControl('*'), userController.updatePassword);

// Expose User Router
module.exports = router;
