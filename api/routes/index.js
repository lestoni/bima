'use strict';

/**
 * Load Module Dependencies
 */
const Router = require('koa-router');
const debug  = require('debug')('api:app-router');

const userRouter     = require('./user');
const rootRouter     = require('./root');
const agentRouter    = require('./agent');
const billRouter     = require('./bill');
const claimantRouter = require('./claimant');
const claimRouter    = require('./claim');
const customerRouter = require('./customer');
const paymentRouter  = require('./payment');
const policyRouter   = require('./policy');
const productRouter  = require('./product');
const providerRouter = require('./provider');
const transactionRouter = require('./transaction');

var appRouter = new Router();

const OPEN_ENDPOINTS = [
    /\/media\/.*/,
    '/users/login',
    '/users/signup',
    '/'
];

// Open Endpoints/Requires Authentication
appRouter.OPEN_ENDPOINTS = OPEN_ENDPOINTS;

// Add Users Router
appRouter.use('/users', userRouter.routes(), userRouter.allowedMethods());
// Add Agents Router
appRouter.use('/agents', agentRouter.routes(), agentRouter.allowedMethods());
// Add Bills Router
appRouter.use('/bills', billRouter.routes(), billRouter.allowedMethods());
// Add Claimants Router
appRouter.use('/claimants', claimantRouter.routes(), claimantRouter.allowedMethods());
// Add Claims Router
appRouter.use('/claims', claimRouter.routes(), claimRouter.allowedMethods());
// Add Customers Router
appRouter.use('/customers', customerRouter.routes(), customerRouter.allowedMethods());
// Add Payments Router
appRouter.use('/payments', paymentRouter.routes(), paymentRouter.allowedMethods());
// Add Policies Router
appRouter.use('/policies', policyRouter.routes(), policyRouter.allowedMethods());
// Add Products Router
appRouter.use('/products', productRouter.routes(), productRouter.allowedMethods());
// Add Providers Router
appRouter.use('/providers', providerRouter.routes(), providerRouter.allowedMethods());
// Add Transactions Router
appRouter.use('/transactions', transactionRouter.routes(), transactionRouter.allowedMethods());
// Add Root Router
appRouter.use('/', rootRouter.routes(), rootRouter.allowedMethods());


// Export App Router
module.exports = appRouter;
