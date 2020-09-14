const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const User = require('../models/User.js');
const redisClient = require('../middleware/init_redis.js');
const signOptions = require('../middleware/jwt_optionInfo.js');
const privateKey = fs.readFileSync('./fileToNotShare/private.pem', 'utf8');

const signToken = function(email) {
    const jwtPayload = { email: email };
    return jwt.sign({ email: email }, privateKey, signOptions);
};

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

const createSession = function(user, cb) {
    const email = user.email;
    const token = signToken(email);
    console.log("token::::::", token);
    setToken(token, email, function(redisReply) {
        if (redisReply) {
            cb({ success: 'true', token, user });
        } else {
            cb(false);
        }
    });
};

const resetExpiryTime = function(key, cb) {
    redisClient.expire(key, 60*60, function(err, redisReply) {
        if (err) {
            new Error("Redis Error: While token expire.")
        } else {
            cb(redisReply);
        }
    });
}

const getAuthTokenId = function(req, res, cb) {
    const { authorization } = req.headers;
    if (req.headers && req.headers.authorization) {
        var authorizationBearerValue = req.headers.authorization;
        authorizationBearerValue = authorizationBearerValue.split("Bearer ")[1];

        return redisClient.get(authorizationBearerValue, (err, reply) => {
            if (err) {
                console.log("err:::::::::", err);
                cb(null);
            } else if (reply == 'null' || reply == null || !reply) {
                console.log("reply:::::::::", reply);
                cb(false);
            } else {
                console.log("reply:wf:::::::", typeof(reply));
                resetExpiryTime(authorizationBearerValue, function(redisReply){
                    cb(redisReply);
                });                
            }
        });
    } else {
        cb(false);
    }
}

const handleSignin = function(req, res, cb) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        console.log("qwerty")
        cb("Email or Password not found.");
    } else {
        User.findOne({ email: email }).then(function(userData) {
            if (!userData) {
                console.log("qwer22222222ty");
                cb("No User data available.");
            } else {
                bcrypt.compare(password, userData.password, function(err, res) {
                    if (res) {
                        console.log("!!!!!!!!!!!");
                        cb(userData);
                    } else {
                        console.log("22222222222222")
                        cb("Error while comparing Encryption.");
                    }
                });
            }
        })
    }
}

module.exports = {
    handleSignin: handleSignin,
    getAuthTokenId: getAuthTokenId,
    createSession: createSession
}