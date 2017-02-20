import tty from 'tty';
import { exec } from 'child_process';
import notifier from 'node-notifier';

function checkPid(pid, cb = function() { notifier.notify(`Process ${pid}: Completed`) }) {
    exec(`ps ${pid}`, (error, stdout, stderr) => {
        if (error) {
            return cb();
        }
        setTimeout(checkPid.bind(this, pid, cb), 1000);
    });
}

function handlePiped() {
    process.stdin.on('data', () => { }); // required so that readable is called on end
    process.stdin.on('end', () => {
        notifier.notify(`Process Completed`);
    });
}

function handlePid(pid) {
    if (!pid) {
        notifier.notify('No pid specified');
        process.exit(0);
    }
    checkPid(pid);
}


export default function main() {
    const isCalledViaPipe = !tty.isatty();
    if (isCalledViaPipe) {
        handlePiped();
    } else {
        handlePid(process.argv[2])
    }
}

