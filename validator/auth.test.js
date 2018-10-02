#!/usr/bin/env node

/*
 *
 * This file validates your auth.js file (which is gitignored) 
 *
 */
const assert = require('assert');
const expect = require('chai').expect;

const ENVIRON = process.env.NODE_ENV? process.env.NODE_ENV : 'development';
const configReadResult = require('dotenv').config({path: require('path').resolve(__dirname,'..',`.${ENVIRON}.env`)});
const {allEnvironmentVariablesDefined, throwEnvVarsUndefinedError}=  require('../src/utils');
if (configReadResult.error){
    throw new Error(`ERROR reading config.${configReadResult.error}`);
}
/* Check if all necessary environ vars are defined.*/
if (!allEnvironmentVariablesDefined()){
    throwEnvVarsUndefinedError();

}else {
  console.log('all env vars defined.');
}

const auth= require('../src/auth/auth.js');

describe('Functions should be defined correctly..', function(){
  it('accountAuthMiddleware should be defined.',function(){
    expect(auth.accountAuthMiddleware).to.be.a('function');
  });


  it('generateAndStore2faToken should return string and be different every time.', async function(){
    let tfatoken = await auth.generateAndStore2faToken();
    expect(tfatoken).to.be.a('string');
    let tfatoken2 = await auth.generateAndStore2faToken();
    expect(tfatoken2).to.not.equal(tfatoken);
  })


  it('send2fatoken should be defined.',function(){
    auth.send2faToken('token');
  })


  it('authenticate2fa token should be defined properly.',function(){
    let token = auth.authenticate2faToken('aabbcc');
    assert.ok(true);
  });


  it('authenticate2fa token should work in integration with generateAndStore2faToken.',async function(){
    let token = await auth.generateAndStore2faToken();
    let results = await auth.authenticate2faToken(token);
    expect(results.isAuthenticated).to.be.a('boolean');
    expect(results.isAuthenticated).to.equal(true);

    let falsetoken = "12t98wioj1tn2blablabla";
    let resultfalse = await auth.authenticate2faToken(falsetoken);
    expect(resultfalse.isAuthenticated).to.be.a('boolean');
    expect(resultfalse.isAuthenticated).to.equal(false);
  });
});

