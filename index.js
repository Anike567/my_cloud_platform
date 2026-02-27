const express = require('express');
const { spawn } = require('child_process');
const generateSymmetricKey = require('./scripts/generateKey');
const { testConnection } = require('./config/db.cofig');
const authController = require('./controller/authentication/signin.controller');
const fetchImageController = require('./controller/fetch/fetchImages.controller');
const uploadController = require('./controller/upload/upload.controller');
const connectFirebase = require('./config/firebase.config');
const deviceSyncRouter = require('./controller/sync/deviceSync.controller');
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
    const output = spawn('hostname', []);
    output.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    output.stdout.on('data', (data) => {
        console.log(`http://${data.toString().trim()}.local:3000`);
    });
});

