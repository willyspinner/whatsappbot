/*
exec general purpose exec_scripts.
exports a method that either returns a promise or undefined if command is not found.
put exec_scripts in exec_scripts directory, located in root..
 */
const {execSimpleCommandArrArgs}  = require('../shellutils');
module.exports = async (arr_message) => {
    if (arr_message[0] === "exec" && arr_message.length >= 2){
        const {stderr,stdout} = await execSimpleCommandArrArgs(`${__dirname}/../../exec_scripts/${arr_message[1]}`, arr_message.slice(2));
        if (stderr !== ''){
            return stdout+stderr;
        }
        return stdout
    }
    return undefined;
};
