#!/bin/bash

monitoring_dir=$(cd $(dirname ${BASH_SOURCE[0]})/.. && pwd)
pid_file=$monitoring_dir/.pid

if [ ! -f $pid_file ]; then
  echo The pid file $pid_file does not exist.
  echo Seems that the server is not running.
  exit 0
fi

# read pid from the file
server_pid=`cat $pid_file`
kill $server_pid

# wait for the server process to stop
tail --pid=$server_pid -f /dev/null

# clean up
rm $pid_file
