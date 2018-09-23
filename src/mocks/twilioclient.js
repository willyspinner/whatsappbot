class mocktwilioclient {
    messages= {
        create: (createArgs)=>{
            return new Promise((resolve,reject)=>{
                console.log("MOCK TWILIO CLIENT: SENDING :", createArgs.body)
                resolve();
            });
        }
    }
}
module.exports = mocktwilioclient;