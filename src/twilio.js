/* Sets up twilio. Either real, or mock. */
const twilio = require('twilio');
const ENVIRON = process.env.NODE_ENV? process.env.NODE_ENV : 'development';
const mocktwilioclient = require('./mocks/twilioclient');
let twilioclient;
switch (ENVIRON){
    case 'production':
        console.log("using REAL twilio client. ");
        twilioclient = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
        break;
    default:
        console.log("using mock twilio client.");
        twilioclient =  new mocktwilioclient();
}
module.exports = twilioclient;/* twilio instance here */;
