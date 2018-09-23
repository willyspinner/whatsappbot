class mocktwilioclient {
    constructor(){
        this.messages= {
                create:(createArgs)=>{
                    return new Promise((resolve,reject)=>{
                        console.log(
`Mock Twilio Client: would have sent to whatsapp:
**********************************************************************
${createArgs.body}
**********************************************************************
                        `);
                        resolve();
                    });
                }
        }
    }
}
module.exports = mocktwilioclient;