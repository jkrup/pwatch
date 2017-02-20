# PWatch

Get notified when your processes finishes.

## Usage

Add `pwatch` at the end of your command.

```
sleep 10 | pwatch
```
or

```
sleep 10 && pwatch
```
or 

```
sleep 10; pwatch
```

Or if you forget to call it when running your command

```
$ scp somelargefile.tar.gz root@remotehost:~
$ ps aux | grep scp
justink          60132   0.0  0.2  3041904  31712 s018  S+   12:15PM   0:00.20 scp somelargefile.tar.gz root@remotehost:~
$ pwatch 60132
```

Then get notified when that process finishes.
![](assets/pwatchinaction.png)