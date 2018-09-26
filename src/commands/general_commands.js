const {execPipedCommand, execSimpleCommand}  = require('../shellutils');
const os = require('os');
const twilioclient = require('../twilio');
module.exports = async (arr_message)=>{
    const length = arr_message.length;
    if(length === 0 )
        return undefined;
    if (length === 1 ) {
        switch(arr_message[0]){
            case "w":
                const { stdout, stderr } = await execSimpleCommand('w');
                await twilioclient.requestTwilioSendToWhatsapp(
                    `*Result*\n \`\`\`${stdout}\`\`\``
                );
                return true;
        }
    }
    if (length === 2){
        switch(arr_message[0]){
            case "status": {
                if ( os.type() !== "Linux"){
                    await twilioclient.requestTwilioSendToWhatsapp(
                    "Sorry! status command needs linux."
                );
                    return true;
                }
                const { stdout, stderr } = await execPipedCommand(
                    ['systemctl' ,'-n' , '0', '--no-pager', 'status' ,arr_message[1]],
                    [ 'head', '-n', '5']
                );
                await twilioclient.requestTwilioSendToWhatsapp(
                    `*Result*\n \`\`\`${stdout}\`\`\``
                );
                return true;
            }
            case 'ip': {
                let result = '';
                if (arr_message[1] === "local"){
                    const { stdout, stderr } = await execSimpleCommand('ip', 'addr', 'show', 'enp3s0');
                    result = `*Result*\n \`\`\`${stdout}\`\`\``;
                }else if (arr_message[1] === "public"){
                    const { stdout, stderr } = await execSimpleCommand(`curl`, `whatismyip.akamai.com`);
                    result = `*Result*\n \`\`\`${stdout}\`\`\``;
                } else{
                    result = "*INCORRECT ip syntax.* chat 'help' for more instructions.";
                }
                await twilioclient.requestTwilioSendToWhatsapp(
                    result
                );
                return true;
            }
            case 'psgrep': {
                try {
                    const { stdout, stderr } = await execPipedCommand(
                        ['ps','aux'],
                        ['grep', arr_message[1]]
                    );
                    await twilioclient.requestTwilioSendToWhatsapp(
                        `*Result*\n \`\`\`${stdout}\`\`\``
                    );
                    return true;
                }catch(e){
                    await twilioclient.requestTwilioSendToWhatsapp(
                        `*PSGREP ERROR. Result*\n ${e}`
                    );
                    return true;
                }
            }

        }
    }
    return undefined;
};
