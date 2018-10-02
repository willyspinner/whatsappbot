 const redis  = require('redis')
 const bluebird = require('bluebird');
 let redisclient;
 const redisconnectionobject = {
     host: process.env.REDIS_HOST,
     port: process.env.REDIS_PORT
 };
 redisclient = redis.createClient(redisconnectionobject);

 redisclient.on('error',(err)=>{
     console.error("redis error", JSON.stringify(err));
     process.exit(1);
 })
 redisclient.on('ready',()=>{
   console.log("redisdb",`redis connection established @ ${redisconnectionobject.host}:${redisconnectionobject.port}`)
 })
 //  <<<<< promisifying our redis commands >>>>>:
 bluebird.promisifyAll(redis.RedisClient.prototype);
 bluebird.promisifyAll(redis.Multi.prototype);
 module.exports.redisDbClient = redisclient;
