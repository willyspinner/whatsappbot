const express = require('express');
const app = express();
const port = process.env.CHATBOT_PORT || 4455;
const responseHandler= require('./src/handler');
const twilio = require('twilio');
const authMiddleware = require('./src/auth/auth');
require('dotenv').config();
if (process.env.NODE_ENV !== "development"){
    if (!process.env.ACCOUNT_SID || !process.env.AUTH_TOKEN || !process.env.MY_PHONE_NUMBER|| !process.env.TWILIO_PHONE_NUMBER || ! process.env.ENDPOINT){
        throw new Error("ACCOUNTS_ID/AUTH_TOKEN/MY_PHONE_NUMBER/TWILIO_PHONE_NUMBER/ENDPOINT ENVIRONMENT VARIABLE NOT DEFINED.");
    }
}

// constants
const endpoint = process.env.ENDPOINT;

// body parser
const bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(function (req, res, next) {
    next();
});
if (process.env.NODE_ENV === "development"){
    console.log("development mode.")
   app.post('/api',async(req,res)=>{
       if (!req.body.Body){
           res.status(400).send("invalid request.");
           return;
       }
       let response;
       try{
           response = await responseHandler(req.body.Body);
       }catch(e){
           console.log("500. error: ",e);
           res.status(500).send(e);
       }
           res.status(200).send(response)
   })
} else{
    app.use(authMiddleware);
    app.post(`/api/${endpoint}`, async (req,res)=>{
            console.log(`received from ${ req.headers['x-real-ip']}:`,req.body.Body);
        
            if (!req.body.Body){
                res.status(400).send("invalid request.");
                return;
            }
            const response = await responseHandler(req.body.Body);
            const twilioclient = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
            twilioclient.messages.create({
                body: response,
                to: `whatsapp:${process.env.MY_PHONE_NUMBER}`,  // Text this number
                from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}` // From a valid Twilio number
            })
                .then((message) => res.status(200).end())
                .catch((e)=>console.error(e));
    });
}
const shutDown = async (signal) => {
    console.log(`signal ${signal}`, `OK. Bye... 👋`);
    process.exit(0);
}
process.on('SIGTERM', () => shutDown('SIGTERM'));
process.on('SIGINT', () => shutDown('SIGINT'));

const server = app.listen(port);
console.log("chatbot_server starting on port ",port);
