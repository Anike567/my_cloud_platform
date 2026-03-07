const admin = require('firebase-admin');
const serviceAccount = require('./../notificationService.json');

let isInitialized = false;

const connectFirebase = async () => {
    if (isInitialized) return admin; 
    
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        
        // Quick verification
        await admin.auth().listUsers(1); 
        console.log("🚀 Firebase Admin Initialized");
        isInitialized = true;
        return admin;
    } catch (error) {
        console.error("❌ Firebase Init Failed:", error.message);
        throw error;
    }
};

module.exports = connectFirebase;