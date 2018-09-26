/* normal dependencies */
const express = require('express');
const moment = require('moment');
const bodyParser = require('body-parser')
const cluster = require('cluster');

/* ENVIRONMENT SETTINGS. SET BY EVERY INSTANCE.*/
const ENVIRON = process.env.NODE_ENV? process.env.NODE_ENV : 'development';
const configReadResult = require('dotenv').config({path: require('path').resolve(process.cwd(),`.${ENVIRON}.env`)});
const {allEnvironmentVariablesDefined, throwEnvVarsUndefinedError}=  require('./src/utils');
if (configReadResult.error){
    throw new Error(`ERROR reading config.${configReadResult.error}`);
}
/* Check if all necessary environ vars are defined.*/
if (!allEnvironmentVariablesDefined()){
    throwEnvVarsUndefinedError();

}
/* needed info for master */
const numCPU = process.env.NUM_CPU || 1;
const port = process.env.CHATBOT_PORT || 4455;
if (cluster.isMaster){
    require('log-timestamp')(() => `[CHATBOT_SERVER][MASTER @ ${process.pid}]|${moment().format('DMMMYY HH:m:ss')}| %s`);
    if (ENVIRON !== "production" ){
        console.log(`\n=> This is development/test mode. To send messages, simply use the command: 
            curl -X POST localhost:${port}/api/${process.env.ENDPOINT} -H 'X-Real-IP:127.0.0.1' -d AccountSid=${process.env.ACCOUNT_SID} -d Body="put your command here"
            (along with any extra parameters used)
            Responses from the chatbot that would have been sent to whatsapp in production mode will be outputted to the terminal here.
        `);
    }else {
        console.log(`\n=> This is Production Mode. Use whatsapp on your phone to talk to this bot.`);
    }
    for (let i = 0; i < numCPU; i++) {
        cluster.fork();
    }
}else {
    require('log-timestamp')(() => `[CHATBOT_SERVER][${process.pid}]|${moment().format('DMMMYY HH:mm:ss')}| %s`);
    console.log(process.env.NODE_ENV? `using environment: ${process.env.NODE_ENV}`: `defaulting to development environment.`);
    /* Our own modules that we use:*/
    const responseHandler= require('./src/handler');
    const {accountAuthMiddleware} = require('./src/auth/auth');

    /* initialization */
    const app = express();


    // twilioclient
    const twilioclient = require('./src/twilio');
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    app.use(accountAuthMiddleware);
    app.post(`/api/${process.env.ENDPOINT}`, async (req, res) => {
        console.log(`received from ${ req.headers['x-real-ip']}:`, req.body.Body);

        if (!req.body.Body) {
            res.status(400).send("invalid request.");
            return;
        }
        await responseHandler(req.body.Body,req,res);

    });
    const server = app.listen(port);
    const shutDown = async (signal) => {
        console.log(`signal ${signal}`, `OK. Bye... 👋`);
        await server.close();
        process.exit(0);
    };
    process.on('SIGTERM', () => shutDown('SIGTERM'));
    process.on('SIGINT', () => shutDown('SIGINT'));

    console.log("chatbot_server starting on port ", port);
}
