const script_command = require('./commands/script_commands');
const general_command = require('./commands/general_commands');
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

module.exports = async (message_text)=>{
/* message_text. Returns a message string.*/
    const arr_message = message_text.toLowerCase().split(" ");
    const script_cmd_response = await script_command(arr_message);
    if (script_cmd_response) {
        return script_cmd_response;
    }
    const general_cmd_response = await general_command(arr_message);
    if (general_cmd_response) {
        return general_cmd_response;
    }
    return intro_string;
}
