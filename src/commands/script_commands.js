/*
exec general purpose exec_scripts.
exports a method that either returns a promise or undefined if command is not found.
put exec_scripts in exec_scripts directory, located in root..
 */
const fs = require('fs');
const {execPipedCommand}  = require('../shellutils');

const auth= require('../auth/auth');
module.exports = async (arr_message) => {
    if (arr_message[0] === "exec" && arr_message[1] === "auth"){
        if (arr_message.length === 3 && arr_message[2] === "request"){
            const token = await auth.generateAndStore2faToken();
            await auth.send2faToken(token);
            return "2FA token generation successful. Please See your 2FA device.";

        } else if (arr_message.length >= 4){
            /* authenticate. */
            const authResult = await auth.authenticate2faToken(arr_message[2]);
            if (authResult.isAuthenticated){
                console.log("2FA Authenticated.");
                const pathname = `${__dirname}/../../exec_scripts/${arr_message[3]}`
                try{
                    fs.accessSync(pathname, fs.constants.X_OK );
                }catch(e){
                        return `script ${arr_message[3]} cannot be executed, or may not exist. Please check. code: ${e.code}, syscall: ${e.syscall}`;
                }
                    const {stderr,stdout} = await execPipedCommand([pathname, ...arr_message.slice(4)], ["head", "-n", 50]);
                    if (stderr !== ''){
                        return stdout+stderr;
                    }
                    return stdout
            }else{
                /* Not authenticated. */
                return `Script authentication error. Reason : ${authResult.reason}`;
            }
        }else{
            /* default */
            return "Script Error. Please issue appropriate commands.";
        }
    }
    return undefined;
};
