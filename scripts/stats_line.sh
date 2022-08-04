#!/bin/bash

DATE=`date "+%H:%M:%S"`
LINE=`adb shell b2g-info | grep Wikipedia | sed -E 's/ +/ /g' | sed -E 's/^ //' | cut -d' ' -f6,7`
echo $DATE $LINE
$0
