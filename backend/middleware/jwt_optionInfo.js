const jwt = require('jsonwebtoken');

const iss = process.env.JWT_ISSUER;
const sub = process.env.JWT_SUBJECT;
const aud = process.env.JWT_AUDIENCE;
const expIn = process.env.JWT_EXP;
const algo = process.env.JWT_ALGO;

const signOptions = {
    issuer: iss,
    subject: sub,
    audience: aud,
    expiresIn: '1h',
    algorithm: algo
}

module.exports = signOptions;