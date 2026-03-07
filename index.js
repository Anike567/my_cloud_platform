const express = require('express');
const { spawn } = require('child_process');
const generateSymmetricKey = require('./scripts/generateKey');
const { testConnection } = require('./config/db.cofig');
const authController = require('./controller/authentication/signin.controller');
const fetchImageController = require('./controller/fetch/fetchImages.controller');
const uploadController = require('./controller/upload/upload.controller');
const connectFirebase = require('./config/firebase.config');
const deviceSyncRouter = require('./controller/sync/deviceSync.controller');
const os = require('os');
require('dotenv').config();



const app = express();
testConnection();
connectFirebase();
const router = express.Router();
generateSymmetricKey();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/sync/hello', (req, res) => {
    console.log("Received request at /sync/hello");
    res.json({ message: 'Hello from sync endpoint!' });
});


app.use('/auth', authController);
app.use('/upload', uploadController);
app.use('/fetch', fetchImageController)
app.use('/sync', deviceSyncRouter);

app.listen(3000, '0.0.0.0', () => {
    let command;
    let args;

    if (os.platform() === 'darwin') {
        command = 'ipconfig';
        args = ['getifaddr', 'en0'];
    } else {
        // Linux/Ubuntu (common for development)
        command = 'hostname';
        // args = ['-I']; 
    }

    const output = spawn(command, args);

    output.stdout.on('data', (data) => {
        // .split(' ')[0] handles cases where hostname -I returns multiple IPs
        const ip = data.toString().trim().split(' ')[1] || data.toString().trim().split(' ')[0];
        console.log(`🚀 Server running at: http://${ip}:3000`);
    });

    output.stderr.on('data', (data) => {
        console.error(`Error fetching IP: ${data}`);
    });
});

