// NOTE: differentiate between production and non-production environments using NODE_ENV.
// NODE_ENV === 'production' ?

// Please implement the following methods:

/* Expressjs middleware to authenticate twilio.*/

module.exports.accountAuthMiddleware= (req,res,next) =>{};


/* generate and store 2fa token safely. Returns the token that we will send to the user */

module.exports.generateAndStore2faToken = async () => { return "sample token";};


/* Send 2fa token to your 2fa device. Returns a promise.*/

module.exports.send2faToken = async(token) => {
    console.log("use token: ",token, "to authorize.");
};


/* authenticate the token passed in as argument. If authenticated, return the object:
*   {isAuthenticated: true}
*   if not, then return:
*   {isAuthenticated:false, reason: "put a reason for denial here." }
* */

module.exports.authenticate2faToken = async (token) => {
return {isAuthenticated: true};
};




