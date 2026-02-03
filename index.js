const express = require('express');
const {spawn} = require('child_process');
const generateSymmetricKey = require('./scripts/generateKey');
const {testConnection} = require('./config/db.cofig');
const authController = require('./controller/authentication/signin.controller');
const uploadController = require('./controller/upload/upload.controller');


const app = express();
testConnection();
const router = express.Router();
generateSymmetricKey();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/upload', uploadController);

app.use('/auth', authController);

app.listen(3000, '0.0.0.0', ()=>{

    const output = spawn('hostname',[]);
    output.stderr.on('data',(data)=>{
        console.error(`stderr: ${data}`);
    });
    output.stdout.on('data',(data)=>{
        console.log(`http://${data.toString().trim()}:3000`);
    });
});

