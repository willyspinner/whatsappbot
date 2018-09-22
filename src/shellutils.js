const { spawn } = require('child_process');
const execSimpleCmdHelper = (cmd,argsArr) => {
    return new Promise((resolve,reject)=>{
        const final_process = spawn(cmd,argsArr);
        let stdout = '';
        let stderr = '';
        final_process.stdout.on('data', (data) => {
            stdout+= data;
        });
        final_process.stderr.on('data', (data) => {
            stderr+= data;
        });
        final_process.on('close', (code) => {
            if (code !== 0 )
                reject({code});
            else
                resolve({stdout,stderr});
        });
    });
};
module.exports = {
    execSimpleCommandArrArgs : (cmd,argsArr)=>{
        return execSimpleCmdHelper(cmd,argsArr);
    },
    execSimpleCommand: (cmd, ...args) => {
        /*
            args is where we can do the following:
            execSimpleCommand("ls","-la", "/bin");
            and args would be ['-la', '/bin'].
         */
        return execSimpleCmdHelper(cmd,args);
    },
    execPipedCommand: (...cmds) => {
        /*cmds are command arrays.
            ["ps', "aux", ],
            ["grep","-i","word_here"]
         */
        return new Promise((resolve,reject)=>{
            const spawns = cmds.map((cmd)=>spawn(cmd[0],cmd.slice(1)));
            for ( let i = 0; i < cmds.length - 1; i++){
                let process1 = spawns[i];
                let process2= spawns[i+1];
                process1.stdout.pipe(process2.stdin);
            }
            const final_process = spawns[cmds.length - 1];
            let stdout = '';
            let stderr = '';
            final_process.stdout.on('data', (data) => {
                stdout+= data;
            });
            final_process.stderr.on('data', (data) => {
                stderr+= data;
            });
            final_process.on('close', (code) => {
                if (code !== 0 )
                    reject({code});
                else
                    resolve({stdout,stderr});
            });
        });
    }
}
