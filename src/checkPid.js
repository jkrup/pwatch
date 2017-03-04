import ps from 'ps-man';
import notifier from 'node-notifier';

export default function checkPid(pid, cb = () => { notifier.notify(`Process ${pid}: Completed`); }) {
  ps.list({ pid }, (err, res) => {
    if (res.length === 0) {
      return cb();
    }
    return setTimeout(checkPid.bind(this, pid, cb), 1000);
  });
}
