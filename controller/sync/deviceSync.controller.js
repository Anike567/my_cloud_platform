const express = require('express');
const deviceSyncRouter = express.Router();
const authenticate = require('./../../middleware/auth.middleware');
const deviceSyncServices = require('./../../services/sync/deviceSync.services');

deviceSyncRouter.post('/sync-token', authenticate, (req, res)=>{
    deviceSyncServices.syncDevice(req, res);
});

module.exports = deviceSyncRouter;