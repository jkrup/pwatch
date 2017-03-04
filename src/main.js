import tty from 'tty';
import notifier from 'node-notifier';
import ps from 'ps-man';
import 'colors';
import { spawn } from 'child_process';

function handlePiped() {
  process.stdin.on('data', () => { }); // required so that readable is called on end
  process.stdin.on('end', () => {
    notifier.notify('Process Completed');
  });
}

function search(term) {
  ps.list({ name: new RegExp(term, 'i') }, (err, res) => {
    const result = res
      .filter(el => !el.command.match(/pwatch search/))
      .map(el => `${el.pid.yellow} - ${el.command}`)
      .join('\n');
    console.log(result);
  });
}

function help() {
  console.log(`
  ${'pwatch'.bold} <pid | command>


  Commands:
    search      [name]      Lists all processes by PID that match "name"


  Examples:

    ${'–'.grey} Notifies after 10 seconds

      ${'$ sleep 10 | pwatch'.cyan}

    ${'–'.grey} See all PID for node related processes

      ${'$ pwatch search node'.cyan}

    ${'–'.grey} Notify me when process 4030 ends

      ${'$ pwatch 4030'.cyan}

    ${'–'.grey} Run a chained process in the background

      ${'$ sleep 10 | pwatch &'.cyan}
  `);
}

function handlePid(pid) {
  if (!pid) {
    notifier.notify('No pid specified');
    process.exit(0);
  }
  if (String(pid).match(/search/i)) {
    search(process.argv[3]);
  } else if (Number.isNaN(Number(pid))) {
    help();
  } else {
    // Run in BG
    spawn('node', ['dist/runCheckPid.js', pid], {
      stdio: 'ignore',
      detached: true,
    }).unref();
  }
}

export default function main() {
  const isCalledViaPipe = !tty.isatty();
  if (isCalledViaPipe) {
    handlePiped();
  } else {
    handlePid(process.argv[2]);
  }
}

