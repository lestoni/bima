'use strict';
/** *
 * Load Module Dependencies.
 */
const debug      = require('debug')('api:agent-controller');
const moment     = require('moment');
const jsonStream = require('streaming-json-stringify');

const config          = require('../config');
const CustomError     = require('../lib/custom-error');
const AgentDal        = require('./dal/agent');
const UserDal         = require('./dal/user');

/**
 * Create a agent.
 *
 * @desc create a agent and add them to the database
 *
 * @param {Function} next Middleware dispatcher
 */
exports.create = function* createAgent(next) {
  debug('create agent');

  // Begin workflow
  let body = this.request.body;

  this.checkBody('name')
      .notEmpty('Name should not be empty');
  this.checkBody('provider')
      .notEmpty('Provider ID is empty')
      .isHexadecimal('Not a valid Provider ID');
  this.checkBody('phone_number')
      .notEmpty('Phone number is empty')
      .isNumeric('Phone number should contain numbers only');
  this.checkBody('password')
      .notEmpty('Password should not be empty')
      .lt(4, 'Password is too short');

  if(this.errors) {
    return this.throw(new CustomError({
      type: 'AGENT_CREATION_ERROR',
      message: JSON.stringify(this.errors)
    }));
  }

  try {
    let user;
    let agent;
    let userData;
    let agentData;

    userData = {
      phone_number: body.phone_number,
      password: body.password,
      role: 'agent'
    };
    user = yield UserDal.create(userData);

    agentData = {
      name: body.name,
      provider: body.provider,
      user: user._id
    };
    agent = yield AgentDal.create(agentData);

    this.status = 201;
    this.body = agent;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'AGENT_CREATION_ERROR',
      message: ex.message
    }));
  }

};

/**
 * Get a single agent.
 *
 * @desc Fetch a agent with the given id from the database.
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchOne = function* fetchOneAgent(next) {
  debug(`fetch agent:${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let agent = yield AgentDal.get(query);

    this.body = agent;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Update a single agent.
 *
 * @desc Fetch a agent with the given id from the database
 *       and update their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.update = function* updateAgent(next) {
  debug(`updating agent: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };
  let body = this.request.body;

  try {
    let agent = yield AgentDal.update(query, body);

    this.body = agent;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Delete/Archive a single agent.
 *
 * @desc Fetch a agent with the given id from the database
 *       and delete their data
 *
 * @param {Function} next Middleware dispatcher
 */
exports.delete = function* deleteAgent(next) {
  debug(`deleting agent: ${this.params.id}`);

  let query = {
    _id: this.params.id
  };

  try {
    let agent = yield AgentDal.delete(query);

    this.body = agent;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of agents with pagination
 *
 * @desc Fetch a collection of agents
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAllByPagination = function* fetchAllagents(next) {
  debug('get a collection of agents');

  let page   = this.query.page || 1;
  let limit  = this.query.per_page || 10;
  let query = {};
  let opts = {
    page: page,
    limit: limit,
    sort: { }
  };

  try {
    let agents = yield AgentDal.getCollectionByPagination(query, opts);

    this.body = agents;

  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: ex.message
    }));

  }

};

/**
 * Get a collection of agents
 *
 * @desc Fetch a collection of agents
 *
 * @param {Function} next Middleware dispatcher
 */
exports.fetchAll = function* fetchAllagents(next) {
  debug('get a collection of agents');

  let query = {};
  let opts = {};

  try {
    let agentsCollectionStream = yield AgentDal.getCollection(query, opts);
    let stream;

    this.type = 'json';

    stream = this.body = agentsCollectionStream.pipe(jsonStream());

    stream.on('error', (err) => {
      stream.end();

      return this.throw(new CustomError({
        type: 'SERVER_ERROR',
        message: 'Error retrieving collection'
      }));
    });
  } catch(ex) {
    return this.throw(new CustomError({
      type: 'SERVER_ERROR',
      message: err.message
    }));
  }


};
