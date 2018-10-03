/* Sets up twilio. Either real, or mock. */
const twilio = require('twilio');
const ENVIRON = process.env.NODE_ENV? process.env.NODE_ENV : 'development';
const mocktwilioclient = require('./mocks/twilioclient');
let twilioclient;
switch (ENVIRON){
    case 'production':
        console.log("using REAL twilio client. ");
        twilioclient = new twilio(process.env.ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        break;
    default:
        console.log("using mock twilio client.");
        twilioclient =  new mocktwilioclient();
}
//module.exports = twilioclient;/* twilio instance here */;
module.exports.requestTwilioSendToWhatsapp = (response)=>{return twilioclient.messages.create({
        body: response,
        to: `whatsapp:${process.env.MY_PHONE_NUMBER}`,  // Text this number
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}` // From a valid Twilio number
    })};
