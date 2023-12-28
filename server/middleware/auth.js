import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'

/** auth middleware */
export default async function Auth(req, res, next) {
    try {
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];

        // retrieve the user details fo the logged in user
        const decodedToken = await jwt.verify(token, JWT_SECRET);

        req.user = decodedToken;
        next()

    } catch (error) {
        res.status(401).json({ error: "Authentication Failed!" })
    }
}


export function localVariables(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}