const jwt = require("jsonwebtoken");
const config = require('../config/general');
const crypto = require('../helper/crypto');

function getIdFromToken(token) {
    // console.log(token);
    var decoded = jwt.verify(token, config.generalArray.jwtSecret);
    // console.log(decoded);
    if (decoded) {
        var decrypted = crypto.decrypt(decoded.emp);
        // console.log(decrypted);
        if (decrypted) {
            return decrypted;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function getNameFromToken(token) {
    var decoded = jwt.verify(token, config.generalArray.jwtSecret);
    if (decoded) {
        var decrypted = crypto.decrypt(decoded.a);
        if (decrypted) {
            return decrypted;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function getEmailFromToken(token) {
    var decoded = jwt.verify(token, config.generalArray.jwtSecret);
    if (decoded) {
        var decrypted = crypto.decrypt(decoded.b);
        if (decrypted) {
            return decrypted;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function getUserRoleFromToken(token) {
    var decoded = jwt.verify(token, config.generalArray.jwtSecret);
    if (decoded) {
        var decrypted = crypto.decrypt(decoded.c);
        if (decrypted) {
            return decrypted;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function verifyOwnToken(id, token) {
    jwt.verify(token, config.generalArray.jwtSecret, (err, decoded) => {
        console.log(decoded);
        if (err) {
            console.log('not matched');
            return false;
        } else {
            if (decoded.sub == crypto.decrypt(decoded.emp) && id == crypto.decrypt(decoded.emp)) {
                console.log('matched');
            } else {
                console.log('not matched');
            }
            // console.log(decoded);
        }
    });
}

exports.getIdFromToken = getIdFromToken;
exports.getNameFromToken = getNameFromToken;
exports.getEmailFromToken = getEmailFromToken;
exports.getUserRoleFromToken = getUserRoleFromToken;
exports.verifyOwnToken = verifyOwnToken;