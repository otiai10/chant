#!/bin/sh
for dir in `ls $GOPATH/src/chant/app | grep -v view`; do
    go fmt chant/app/$dir
done
