let jwt = require('jsonwebtoken');
const crypto = require('../helper/crypto');
const config = require('../config/general');

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if (token) {

        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        jwt.verify(token, config.generalArray.jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(402).json({
                    success: false,
                    msg: 'Token is not valid'
                });
            } else {
                if (decoded.sub == crypto.decrypt(decoded.emp)) {
                    req.decoded = decoded;
                    next();
                } else {
                    return res.status(402).json({
                        success: false,
                        msg: 'Token is not valid'
                    });
                }

            }
        });
    } else {
        return res.status(402).json({
            success: false,
            msg: 'Auth token is not supplied'
        });
    }
};

module.exports = {
    checkToken: checkToken,
}