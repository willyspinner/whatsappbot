module.exports.allEnvironmentVariablesDefined = ()=>{
    if (!process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.HASH_SECRET || !process.env.ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.MY_PHONE_NUMBER|| !process.env.TWILIO_PHONE_NUMBER || ! process.env.ENDPOINT){
        return false;
    }
    return true;
}
module.exports.throwEnvVarsUndefinedError = ()=>{
    throw new Error("REDIS_HOST / REDIS_PORT / HASH_SECRET / ACCOUNT_SID / TWILIO_AUTH_TOKEN / MY_PHONE_NUMBER / TWILIO_PHONE_NUMBER / ENDPOINT ENVIRONMENT VARIABLE NOT DEFINED.");
};