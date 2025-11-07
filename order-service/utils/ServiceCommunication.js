const CircuitBreaker = require('opossum');
const axios = require('axios');

const defaultOptions = {
    timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 30000 // After 30 seconds, try again.
};

class ServiceCommunication {
    constructor(baseURL, options = {}) {
        this.baseURL = baseURL;
        this.options = { ...defaultOptions, ...options };
        this.breaker = null;
    }

    createBreaker(fn) {
        return new CircuitBreaker(fn, this.options);
    }

    async checkHealth() {
        try {
            const response = await axios.get(`${this.baseURL}/health`);
            return response.data.status === 'UP';
        } catch (error) {
            return false;
        }
    }

    async makeRequest(method, path, data = null) {
        if (!this.breaker) {
            this.breaker = this.createBreaker(async () => {
                const config = {
                    method,
                    url: `${this.baseURL}${path}`,
                    ...(data && { data })
                };
                const response = await axios(config);
                return response.data;
            });
        }

        try {
            return await this.breaker.fire();
        } catch (error) {
            throw new Error(`Service request failed: ${error.message}`);
        }
    }
}

module.exports = ServiceCommunication;