const User = require('../models/User.js');
const signInAuth = require('../middleware/signIn_auth.js');


const redisClient = require('../middleware/init_redis.js')

module.exports = function(req, res) {
    try {
        const { authorization } = req.headers;
        if (authorization) {
            console.log("authorization:::::::", authorization);
            signInAuth.getAuthTokenId(req, res, function(isAuthenticated) {
                console.log("isSignAuthenticated::", isAuthenticated)
                if (isAuthenticated) {
                    res.status(201).send({ msg: "User Signed In" });
                } else {
                    res.status(401).send({ code: 401, msg: 'Unauthorized' });
                }
            });
        } else {
            signInAuth.handleSignin(req, res, function(data) {
                if (data && data['email']) {
                    signInAuth.createSession(data, function(response) {
                        res.cookie('jwt', response.token, {expire: 400000 + Date.now(), maxAge: 60*15, secure: true});
                        // res.clearCookie(cookieName);
                        res.status(201).send({ code: 201, response: response });
                    })
                } else {
                    res.status(400).send({code:400, msg: 'Error while authenticating user.' });
                }
            });
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({ msg: 'Error while registering user data.', error: error });
    }
};