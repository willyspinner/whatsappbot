/* dependencies */
const express = require('express');
const twilio = require('twilio');
const moment = require('moment');
const bodyParser = require('body-parser')

require('log-timestamp')(function() { return `[CHATBOT_SERVER][PID ${process.pid}] ${moment().format('DMMMYY HH:mm:ss')}: %s`  });
console.log(process.env.NODE_ENV? `using environment: ${process.env.NODE_ENV}`: `defaulting to development environment.`);
const ENVIRON = process.env.NODE_ENV? process.env.NODE_ENV : 'development';
require('dotenv').config({path: require('path').resolve(process.cwd(),`.${ENVIRON}.env`)});
if (!process.env.HASH_SECRET || !process.env.ACCOUNT_SID || !process.env.AUTH_TOKEN || !process.env.MY_PHONE_NUMBER|| !process.env.TWILIO_PHONE_NUMBER || ! process.env.ENDPOINT){
    throw new Error("HASH_SECRET/ACCOUNT_SID/AUTH_TOKEN/MY_PHONE_NUMBER/TWILIO_PHONE_NUMBER/ENDPOINT ENVIRONMENT VARIABLE NOT DEFINED.");
}
/* files used*/
const responseHandler= require('./src/handler');
const {accountAuthMiddleware} = require('./src/auth/auth');
const mocktwilioclient = require('./src/mocks/twilioclient');

 /* initialization */
let twilioclient;
const app = express();
const port = process.env.CHATBOT_PORT || 4455;

switch (ENVIRON){
    case 'production':
        console.log("using REAL twilio client. ");
        twilioclient = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
        break;
    default:
        console.log("using mock twilio client.");
        twilioclient =  new mocktwilioclient();
}

// constants
const endpoint = process.env.ENDPOINT;

// body parser
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(accountAuthMiddleware);
app.post(`/api/${endpoint}`, async (req,res)=>{
        console.log(`received from ${ req.headers['x-real-ip']}:`,req.body.Body);

        if (!req.body.Body){
            res.status(400).send("invalid request.");
            return;
        }
        const response = await responseHandler(req.body.Body);
        twilioclient.messages.create({
            body: response,
            to: `whatsapp:${process.env.MY_PHONE_NUMBER}`,  // Text this number
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}` // From a valid Twilio number
        })
            .then((message) => res.status(200).end())
            .catch((e)=>{
                console.error("TWILIO FAILED.");
                console.error(e);
                }
            );

});
const shutDown = async (signal) => {
    console.log(`signal ${signal}`, `OK. Bye... 👋`);
    process.exit(0);
};
process.on('SIGTERM', () => shutDown('SIGTERM'));
process.on('SIGINT', () => shutDown('SIGINT'));

const server = app.listen(port);
console.log("chatbot_server starting on port ",port);
