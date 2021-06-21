#!/bin/bash

DATE=`date "+%H:%M:%S"`
LINE=`adb shell b2g-info | grep Wikipedia | sed -E 's/ +/ /g' | sed -E 's/^ //'`
echo $DATE $LINE
$0
