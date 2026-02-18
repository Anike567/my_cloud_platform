const Redis = require('ioredis');

class RedisConfiguration {
    static redisInstance = null;
    static subscriberInstance = null;

    /**
     * Standard connection for GET/SET/DEL commands
     */
    static getClient() {
        if (!this.redisInstance) {
            this.redisInstance = new Redis({
                host: '127.0.0.1',
                port: 6379,
                retryStrategy: (times) => Math.min(times * 50, 2000),
            });

            this.redisInstance.on('connect', () => console.log('🚀 Redis Command Client Connected'));
            this.redisInstance.on('error', (err) => console.error('❌ Redis Error:', err));
        }
        return this.redisInstance;
    }

    /**
     * Dedicated connection for Pub/Sub (Listening to channels)
     */
    static getSubscriber() {
        if (!this.subscriberInstance) {
            this.subscriberInstance = new Redis({
                host: '127.0.0.1',
                port: 6379,
            });
            console.log('📡 Redis Subscriber Client Initialized');
        }
        return this.subscriberInstance;
    }

    /**
     * Subscribe to a channel and handle incoming messages
     * @param {string} channel - The name of the channel (e.g., 'image_processed')
     * @param {function} callback - Function to run when a message arrives
     */
    static async subscribeChannel(channel, callback) {
        const sub = this.getSubscriber();
        
        await sub.subscribe(channel);
        console.log(`🍦 Subscribed to channel: ${channel}`);

        sub.on('message', (chan, message) => {
            if (chan === channel) {
                try {
                    const parsedData = JSON.parse(message);
                    callback(parsedData);
                } catch (e) {
                    callback(message);
                }
            }
        });
    }

    /**
     * Publish a message to a channel
     */
    static publishMessage(channel, data) {
        const client = this.getClient();
        const message = typeof data === 'object' ? JSON.stringify(data) : data;
        return client.publish(channel, message);
    }
}

module.exports = RedisConfiguration;