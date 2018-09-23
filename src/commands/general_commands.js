const {execPipedCommand, execSimpleCommand}  = require('../shellutils');
const os = require('os');
module.exports = async (arr_message)=>{
    const length = arr_message.length;
    if(length === 0 )
        return undefined;
    if (length === 1 ) {
        switch(arr_message[0]){
            case "w":
                const { stdout, stderr } = await execSimpleCommand('w');
                return `*Result*\n \`\`\`${stdout}\`\`\``;
        }
    }
    if (length === 2){
        switch(arr_message[0]){
            case "status": {
                if ( os.type() !== "Linux"){
                    return "Sorry! status command needs linux.";
                }
                const { stdout, stderr } = await execPipedCommand(
                    ['systemctl' ,'-n' , '0', '--no-pager', 'status' ,arr_message[1]],
                    [ 'head', '-n', '5']
                );
                return `*Result*\n \`\`\`${stdout}\`\`\``;
            }
            case 'ip': {
                if (arr_message[1] === "local"){
                    const { stdout, stderr } = await execSimpleCommand('ip', 'addr', 'show', 'enp3s0');
                    return `*Result*\n \`\`\`${stdout}\`\`\``;
                }else if (arr_message[1] === "public"){
                    const { stdout, stderr } = await execSimpleCommand(`curl`, `whatismyip.akamai.com`);
                    return `*Result*\n \`\`\`${stdout}\`\`\``;
                }
                break;
            }
            case 'psgrep': {
                console.log("trying to psgrep");
                try {
                    const { stdout, stderr } = await execPipedCommand(
                        ['ps','aux'],
                        ['grep', arr_message[1]]
                    );
                    return `*Result*\n \`\`\`${stdout}\`\`\``;
                }catch(e){
                    console.log("ps grep caught here");
                    return e;
                }
            }

        }
    }
    return undefined;
};
