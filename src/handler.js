const script_command = require('./commands/script_commands');
const general_command = require('./commands/general_commands');
const twilioclient= require('./twilio')
const cmds= {
    "w": "w command (uptime, users, load, etc.)",
    "status SERVICE":"systemctl status the requested ```SERVICE```.",
    "ip local" : "show local enp3s0 ip.",
    "ip public": "show public ip (by whatismyip).",
    "psgrep SERVICE": "```ps aux | grep SERVICE```.",
    "exec TOKEN SCRIPT arg1 arg2 ...": "authenticate with 2FA ```TOKEN``` and execute ```SCRIPT``` with arguments $1=arg1, $2=arg2 in exec_scripts directory.",
    "exec auth request": "Request for 2FA auth token."
};
const commands = Object.keys(cmds)
    .map(key=> `> \`\`\`${key}\`\`\` \n     ${cmds[key]}`)
    .join("\n");
const intro_string= 
`
Hi! I'm Bearbot, a bot for the Jusuf Ubuntu Servers.
*Commands* 
${commands}
`;

module.exports = async (message_text,req,res)=>{
/* message_text. Returns a message string.*/
    /*TODO: REFACTOR THIS METHOD. Because sometimes we don't want a be all end all (req res) kind of structure,
    sometimes the bot should send a message confirming that some build (that may take some time) is starting.

    So the methods themselves (script_command, general_command) can themselves call the twilio send commands.
    The methods should return falsy if further interpretation by other commands is required, or true if ithe response fully matches user action.

     */
    const arr_message = message_text.toLowerCase().split(" ");
    const script_cmd_end_target = await script_command(arr_message);
    if (script_cmd_end_target) {
        res.json({status:200, message: "script cmd ok."});
        return true;
    }
    const general_command_end_target = await general_command(arr_message);
    if (general_command_end_target) {
       res.json({status:200, message: "general cmd ok."});
        return true;
    }
    //return intro_string;
    /* send intro string here, then return false. */

    let okFlag = true;
    let message= "default help info ok.";
    await twilioclient.requestTwilioSendToWhatsapp(intro_string)
        .catch((e) => {
                console.error("TWILIO FAILED.");
                console.error(e);
                okFlag= false;
            message= "failed to push to twilio.";
            }
        );
    res.json({status:okFlag? 200:500, message});
    return true;
}
