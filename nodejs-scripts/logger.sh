#!/bin/sh
if ps -ef | grep -v grep | grep "node coffee-grunt-logger.js" ; then
    exit 0
else
    node coffee-grunt-logger.js
    exit 0
fi