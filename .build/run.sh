#!/bin/sh
SCRIPTPATH=$(cd "$(dirname "$0")"; pwd)
"$SCRIPTPATH/chant" -importPath chant -srcPath "$SCRIPTPATH/src" -runMode prod
