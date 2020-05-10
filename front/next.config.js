require('dotenv').config();

module.exports = {
    env: {
        API_BASE_URL: process.env.API_BASE_URL,
        WSS_BASE_URL: process.env.WSS_BASE_URL
    }
}