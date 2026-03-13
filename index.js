const express = require('express');
const helmet = require('helmet'); // Fixed spelling
const { spawn } = require('child_process');
const os = require('os');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Controllers & Configs
const generateSymmetricKey = require('./scripts/generateKey');
const authController = require('./controller/authentication/signin.controller');
const fetchImageController = require('./controller/fetch/fetchImages.controller');
const uploadController = require('./controller/upload/upload.controller');
const deviceSyncRouter = require('./controller/sync/deviceSync.controller');

const app = express();

// --- Middleware ---
app.use(helmet()); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Routes ---
app.get('/', (req, res) => res.status(200).json({ message: "Secure Server Active" }));
app.use('/auth', authController);
app.use('/upload', uploadController);
app.use('/fetch', fetchImageController);
app.use('/sync', deviceSyncRouter);

// --- Server Setup ---
const options = {
    key: fs.readFileSync(path.join(__dirname, '../server.key')),
    cert: fs.readFileSync(path.join(__dirname, '../server.cert'))
};

const server = https.createServer(options, app);

// Keep-Alive Configs
server.maxRequestsPerSocket = 100;
server.keepAliveTimeout = 10000;
server.headersTimeout = 11000;

// listen on 0.0.0.0 (all interfaces)
server.listen(3000, '0.0.0.0', () => {
    generateSymmetricKey();
    console.log('Server bound to 0.0.0.0:3000');

    // IP Detection Logic
    let command = os.platform() === 'darwin' ? 'ipconfig' : 'hostname';
    let args = os.platform() === 'darwin' ? ['getifaddr', 'en0'] : [];

    const output = spawn(command, args);
    output.stdout.on('data', (data) => {
        const ip = data.toString().trim().split(' ')[1] || data.toString().trim().split(' ')[0];
        console.log(`🚀 Access internally via: https://${ip}:3000/`);
    });
});