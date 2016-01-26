'use strict';
/**
 * Agent Router
 */

/**
 * Load Module Dependencies.
 */
const Router  = require('koa-router');
const debug   = require('debug')('api:agent-router');

const agentController     = require('../controllers/agent');
const accessControl       = require('../controllers/auth').accessControl;

var router  = Router();

/**
 * @api {post} /agents/create Create an agent
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Agent
 *
 * @apiDescription Create a new agent.
 *
 * @apiParam {String} name name of the agent
 * @apiParam {String} password Password for the Agent
 * @apiParam {String} phone_number Phone Number
 * @apiParam {String} provider Insurance Provider ID whom the Agent is affiliated with.
 *
 * @apiParamExample Request Example:
 *  {
 *    "name": "John Doe",
 *    "password": "password",
 *    "phone_number": "254700112233",
 *    "provider" : "556e1174a8952c9521286a60"
 *  }
 *
 * @apiSuccess {String} _id agent id
 * @apiSuccess {String} name name of the agent
 * @apiSuccess {Object} address Agent address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 * @apiSuccess {Object} contact_info Contact information
 * @apiSuccess {String} contact_info.email Email Address
 * @apiSuccess {String} contact_info.mobile_no Mobile Phone Number
 * @apiSuccess {Object} provider Insurance Provider whom the Agent is affiliated with.
 * @apiSuccess {Object} user User Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "name": "John Doe",
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
 *    "email": "agent@email.com",
 *    "provider": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *    }
 *  }
 *
 */
router.post('/create', accessControl(['admin', 'provider']), agentController.create);

/**
 * @api {get} /agents/:id Get Agent
 * @apiVersion 1.0.0
 * @apiName Get
 * @apiGroup Agent
 *
 * @apiDescription Get a agent with the given id
 *
 * @apiSuccess {String} _id agent id
 * @apiSuccess {String} name name of the agent
 * @apiSuccess {Object} address Agent address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 * @apiSuccess {Object} contact_info Contact information
 * @apiSuccess {String} contact_info.email Email Address
 * @apiSuccess {String} contact_info.mobile_no Mobile Phone Number
 * @apiSuccess {Object} provider Insurance Provider whom the Agent is affiliated with.
 * @apiSuccess {Object} user User Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "name": "John Doe",
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
 *    "email": "agent@email.com",
 *    "provider": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *    }
 *  }
 *
 */
router.get('/:id', accessControl(['agent', 'admin', 'provider']), agentController.fetchOne);

/**
 * @api {put} /agents/:id Update Agent
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Agent
 *
 * @apiDescription Update a agent with the given id
 *
 * @apiParam {Object} Data Update data
 *
 * @apiParamExample Request Example:
 * {
 *
 * }
 *
 * @apiSuccess {String} _id agent id
 * @apiSuccess {String} name name of the agent
 * @apiSuccess {Object} address Agent address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 * @apiSuccess {Object} contact_info Contact information
 * @apiSuccess {String} contact_info.email Email Address
 * @apiSuccess {String} contact_info.mobile_no Mobile Phone Number
 * @apiSuccess {Object} provider Insurance Provider whom the Agent is affiliated with.
 * @apiSuccess {Object} user User Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "name": "John Doe",
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
 *    "email": "agent@email.com",
 *    "provider": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 */
router.put('/:id', accessControl(['provider', 'agent', 'admin']), agentController.update);

/**
 * @api {get} /agents/paginate?page=<RESULTS_PAGE>&per_page=<RESULTS_PER_PAGE> Get agents collection
 * @apiVersion 1.0.0
 * @apiName FetchAllByPagination
 * @apiGroup Agent
 *
 * @apiDescription Get a collection of agents. The endpoint has pagination
 * out of the box. Use these params to query with pagination: `page=<RESULTS_PAGE`
 * and `per_page=<RESULTS_PER_PAGE>`.
 *
 * @apiSuccess {String} _id agent id
 * @apiSuccess {String} name name of the agent
 * @apiSuccess {Object} address Agent address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 * @apiSuccess {Object} contact_info Contact information
 * @apiSuccess {String} contact_info.email Email Address
 * @apiSuccess {String} contact_info.mobile_no Mobile Phone Number
 * @apiSuccess {Object} provider Insurance Provider whom the Agent is affiliated with.
 * @apiSuccess {Object} user User Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "total_pages": 1,
 *    "total_docs_count": 0,
 *    "docs": [{
 *      "_id" : "556e1174a8952c9521286a60"
 *      "name": "John Doe",
 *      "address": {
 *        "street": "Old Tree, Phase 1, New Estate",
 *        "locality_name": "south sea",
 *        "country": "Kenya",
 *        "city": "Nairobi",
 *        "location": {
 *          "lat": 0.09013,
 *          "long": 12.3562100
 *        }
 *      },
 *      "email": "agent@email.com",
 *      "provider": {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      },
 *      "user": {
 *        "_id" : "556e1174a8952c9521286a60",
 *        ...
 *      }
 *    }]
 *  }
 *
 */
router.get('/paginate', accessControl(['admin', 'provider']), agentController.fetchAllByPagination);

/**
 * @api {get} /agents/all Get agents collection
 * @apiVersion 1.0.0
 * @apiName FetchAll
 * @apiGroup Agent
 *
 * @apiDescription Get a collection of agents.
 *
 * @apiSuccess {String} _id agent id
 * @apiSuccess {String} name name of the agent
 * @apiSuccess {Object} address Agent address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 * @apiSuccess {Object} contact_info Contact information
 * @apiSuccess {String} contact_info.email Email Address
 * @apiSuccess {String} contact_info.mobile_no Mobile Phone Number
 * @apiSuccess {Object} provider Insurance Provider whom the Agent is affiliated with.
 * @apiSuccess {Object} user User Data
 *
 * @apiSuccessExample Response Example:
 *  [{
 *    "_id" : "556e1174a8952c9521286a60"
 *    "name": "John Doe",
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
 *    "email": "agent@email.com",
 *    "provider": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }]
 *
 */
router.get('/all', accessControl(['admin', 'provider']), agentController.fetchAll);

/**
 * @api {delete} /agents/:id Delete Agent
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Agent
 *
 * @apiDescription Delete a agent with the given id
 *
 * @apiSuccess {String} _id agent id
 * @apiSuccess {String} name name of the agent
 * @apiSuccess {Object} address Agent address information
 * @apiSuccess {String} address.street Street name
 * @apiSuccess {String} address.locality_name Locality name
 * @apiSuccess {String} address.country Country name
 * @apiSuccess {String} address.city City name
 * @apiSuccess {Object} address.location Location Coordinates
 * @apiSuccess {Number} address.location.lat Latitude coordinate values
 * @apiSuccess {Number} address.location.long Longitude coordinate values
 * @apiSuccess {Object} contact_info Contact information
 * @apiSuccess {String} contact_info.email Email Address
 * @apiSuccess {String} contact_info.mobile_no Mobile Phone Number
 * @apiSuccess {Object} provider Insurance Provider whom the Agent is affiliated with.
 * @apiSuccess {Object} user User Data
 *
 * @apiSuccessExample Response Example:
 *  {
 *    "_id" : "556e1174a8952c9521286a60"
 *    "name": "John Doe",
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
 *    "email": "agent@email.com",
 *    "provider": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    },
 *    "user": {
 *      "_id" : "556e1174a8952c9521286a60",
 *      ...
 *    }
 *  }
 *
 */
router.delete('/:id', accessControl(['provider', 'admin']), agentController.delete);

// Expose Agent Agentr
module.exports = router;
