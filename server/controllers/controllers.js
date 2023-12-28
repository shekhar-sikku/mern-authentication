/* eslint-disable no-unused-vars */
import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import otpGenerator from 'otp-generator';


/** middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        const { username } = req.method == "GET" ? req.query : req.body;

        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });

        next();
    } catch (error) {
        return res.status(404).send({ error: "Authentication Error!" });
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kolas Light, Germany",
  "profile": ""
}
*/
export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }).then((err, user) => {
                if (err) reject(new Error(err));
                if (user) reject({ error: "Username Already Exist!" });

                resolve();
            }).catch(err => reject({ err }));
        });

        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }).then((err, email) => {
                if (err) reject(new Error(err));
                if (email) reject({ error: "Email Already Exist!" });

                resolve();
            }).catch(err => reject({ err }));
        });

        Promise.all([existUsername, existEmail])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            user.save()
                                .then(result => res.status(201).send({
                                    msg: "User Register Successfully!",
                                    username: result.username
                                }))
                                .catch(error => res.status(500).send({ error: error.message }))

                        }).catch(error => {
                            return res.status(500).send({
                                error: `Unable to hash password : ${error.message}`
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ error: "Something Went Wrong, Unable to Register User!" })
            })
    } catch (error) {
        res.status(500).send(error.message);
    }
}


/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        UserModel.findOne({ username }).then(user => {
            bcrypt.compare(password, user.password).then(passwordCheck => {

                if (!passwordCheck) return res.status(400).send({ error: "Don't have Password" });

                // create jwt token
                const token = jwt.sign({
                    userId: user._id,
                    username: user.username
                }, JWT_SECRET, { expiresIn: "24h" });

                return res.status(200).send({
                    msg: "User Login Successfully!",
                    username: user.username,
                    token
                });

            }).catch(error => {
                return res.status(400).send({ error: "Password doesn't match!" })
            })
        }).catch(error => {
            return res.status(404).send({ error: "User with this username not found!" });
        })
    } catch (error) {
        return res.status(500).send({ error });
    }
}


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
    const { username } = req.params;

    if (!username) return res.status(501).send({ error: "Invalid Username!" });

    const user = await UserModel.findOne({ username });

    if (!user) return res.status(501).send({ error: "Couldn't Find the User!" });

    try {
        const loggedInUser = await UserModel.findById(user._id).select('-password');
        return res.status(201).send(loggedInUser);

    } catch (error) {
        return res.status(404).send({ error: "Cannot Find User Data!" });
    }
}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
    const { userId } = req.user;
    const body = req?.body;

    try {
        const user = await UserModel.findByIdAndUpdate(userId,
            body
            // { $set: { email } }
            , { new: true }).select("-password");

        return res.status(200).send({ msg: "User Details Updated!", data: user });
    } catch (error) {
        return res.status(401).send({ error });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, {
        lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
    });
    res.status(201).send({ code: req.app.locals.OTP });
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({ msg: 'Verify Successfully!' })
    }
    return res.status(400).send({ error: "Invalid OTP" });
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ msg: "Access Granted!" })
    }
    return res.status(440).send({ error: "Session expired!" })
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {
        if (!req.app.locals.resetSession) return res.status(403).send({ error: "Session expired!" });

        const { username, password } = req.body;

        const user = await UserModel.findOne({ username });

        if (!user) return res.status(404).send({ error: "Can't find User!" });

        if (user && password) {

            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                const userPassRest = await UserModel.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } },
                    { new: false }).select("-password");

                if (userPassRest) {
                    req.app.locals.resetSession = false;
                    return res.status(201).send({ msg: "Password Reset Successfully!", user: userPassRest });
                } else {
                    return res.status(409).send({ error: "Unable to reset password!" });
                }
            } catch (error) {
                return res.status(500).send({ error })
            }
        }
    } catch (error) {
        return res.status(401).send({ error })
    }
}