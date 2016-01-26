'use strict';
// Access Layer for Agent Data.

/**
 * Load Module Dependencies.
 */
const debug   = require('debug')('api:dal-agent');
const moment  = require('moment');
const _       = require('lodash');
const co      = require('co');

const Agent    = require('../../models/agent');
const Provider = require('../../models/provider');
const User     = require('../../models/user');
const mongoUpdate = require('../../lib/mongo-update');

const returnFields = Agent.attributes;
var population = [{
  path: 'provider',
  select: Provider.attributes
},{
  path: 'user',
  select: User.attributes
}];

/**
 * create a new agent.
 *
 * @desc  creates a new agent and saves them
 *        in the database
 *
 * @param {Object}  agentData  Data for the agent to create
 */
exports.create = function create(agentData) {
  debug('creating a new agent');

  let searchQuery = {
    name: agentData.name,
    provider: agentData.provider
  };

  return co(function* () {
    let isPresent = yield Agent.findOne(searchQuery).exec();

    if(isPresent) {
      let err = new Error('Agent Already Exists');
      err.type = 'AGENT_CREATION_ERROR';

      return yield Promise.reject(err);
    }

    let newAgent = new Agent(agentData);
    let agent = yield newAgent.save();

    return yield exports.get({ _id: agent._id});

  }).then((agent) => {
    return Promise.resolve(agent);
  }).catch((err) => {
    return Promise.reject(err);
  });

};

/**
 * delete a agent
 *
 * @desc  delete data of the agent with the given
 *        id
 *
 * @param {Object}  query   Query Object
 */
exports.delete = function deleteItem(query) {
  debug(`deleting agent: ${query}`);

  return co(function* () {
    let agent = yield exports.get(query);
    let _empty = {};

    if(!agent) {
      return _empty;
    } else {
      yield agent.remove();

      return agent;
    }
  }).then((agent) => {
    return Promise.resolve(agent);
  }, (err) => {
    return Promise.reject(err);
  });
};

/**
 * update a agent
 *
 * @desc  update data of the agent with the given
 *        id
 *
 * @param {Object} query Query object
 * @param {Object} updates  Update data
 */
exports.update = function update(query, updates) {
  debug(`updating agent: ${query}`);

  let now = moment().toISOString();
  let opts = {
    'new': true,
    select: returnFields
  };

  updates = mongoUpdate(updates);

  let promise = Agent
      .findOneAndUpdate(query, updates, opts)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a agent.
 *
 * @desc get a agent with the given id from db
 *
 * @param {Object} query Query Object
 */
exports.get = function get(query) {
  debug(`getting agent ${JSON.stringify(query)}`);

  let promise = Agent
      .findOne(query, returnFields)
      .populate(population)
      .exec();

  return promise;
};

/**
 * get a collection of agents
 *
 * @desc get a collection of agents from db
 *
 * @param {Object} query Query Object
 */
exports.getCollection = function getCollection(query, qs) {
  debug('fetching a collection of agents');

  return new Promise((resolve, reject) => {
    resolve(
       Agent
       .find(query, returnFields)
       .populate(population)
       .stream());
  });

};

/**
 * get a collection of agents using pagination
 *
 * @desc get a collection of agents from db
 *
 * @param {Object} query Query Object
 */
exports.getCollectionByPagination = function getCollection(query, qs) {
  debug('fetching a collection of agents');

  let opts = {
    columns:  returnFields,
    sortBy:   qs.sort || {},
    populate: population,
    page:     qs.page,
    limit:    qs.limit
  };

  return new Promise((resolve, reject) => {
    Agent.paginate(query, opts, function (err, docs) {
      if(err) {
        return reject(err);
      }

      let data = {
        total_pages: docs.pages,
        total_docs_count: docs.total,
        current_page: docs.page,
        docs: docs.docs
      };

      resolve(data);

    });
  });

};
