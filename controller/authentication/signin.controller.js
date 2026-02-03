const express = require('express');
const authenticationService = require('../../services/auth/authentication.service');


const authServives = new authenticationService();
const authController  = express.Router();

authController.post('/signin',(req, res)=>{
    authServives.signin(req, res);
});

authController.post('/signup', (req, res) => {
    authServives.signup(req, res);
});


module.exports = authController;