const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const signOptions = require('../middleware/jwt_optionInfo.js');
const privateKey = fs.readFileSync('./fileToNotShare/private.pem', 'utf8');
const redisClient = require('../middleware/init_redis.js');

const setToken = function(key, value, cb) {
    redisClient.set(key, value, function(err, reply) {
        if (err) {
            new Error("Redis Error while set token");
        } else {
            redisClient.expire(key, 60*15, function(err, redisReply) {
                if (err) {
                    new Error("Redis Error: While token expire.")
                } else {
                    cb(reply);
                }
            });
        }
    });
}

const generateAuthToken = function(userInfo, cb) {
    // Generate an auth token for the user
    if (userInfo) {
        try {
            var token = jwt.sign({ email: userInfo.email }, privateKey, signOptions);
            setToken(token, userInfo.email, function(redisReply) {
                if (redisReply) {
                    cb(token);
                } else {
                    cb(null);
                }
            });            
        } catch (error) {
            cb(null);
            console.log("Error: Error while genrating Token", error);
        }
    } else {
        cb(null);
    }
}

const isDuplicateCredentials = function(email, cb) {
    try {
        if (email) {
            User.findOne({ email: email }).then(function(userData, err) {
                if (userData) {
                    cb(true);
                } else {
                    cb(false);
                }
            });
        } else {
            cb(null);
            console.log("isDuplicateCredentials: Method email not found.")
        }
    } catch (error) {
        cb(null);
        console.log("Error: Error while checking user existance.", error);
    }

}

module.exports = {
    isDuplicateCredentials: isDuplicateCredentials,
    generateAuthToken: generateAuthToken
}