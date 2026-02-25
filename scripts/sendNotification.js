const admin = require('firebase-admin');
const token = process.env.TEST_FCM_TOKEN;
async function sendNotification(reqId, location) {
    const message = {
        data: {
            type: 'SYNC_DATA',
            reqId : reqId,
            location : "data/images/ok",
            title: 'Silent Update',
        },
        android: {
            priority: 'high',
        },
        token: token
    };

    try {
        // Return the response so the caller (API) can send it to the user
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
        return { success: true, messageId: response };
    } catch (error) {
        console.error('Error sending message:', error);
        return { success: false, error: error.message };
    }
}

module.exports = sendNotification;