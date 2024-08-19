#!/bin/bash

# Before run: chmod a+x upload.sh

# Local Variables
ARGS=("$@")
WHEREIAM=$(pwd)
BUILD_NUMBER_OLD="$(cat $WHEREIAM/VERSION)"
BUILD_GITHUB_PATH="$(cat $WHEREIAM/GITHUB_PATH)"
BUILD_NUMBER_NEW="${ARGS[0]}"

if [[ $# -eq 0 ]] ; then
    echo "New version file needsss!"
    exit 1
fi

# sed Checker
if [ -x "$(command -v sed)" ]
then
    # index.html update version tags
    sed -e 's|BUILD_NUMBER|'$BUILD_NUMBER_NEW'|g' \
    -e 's|BUILD_GITHUB_PATH|'$BUILD_GITHUB_PATH'|g' $WHEREIAM/src/index.html > $WHEREIAM/docs/index.html

    # manifest.json update version tags
    sed -e 's|BUILD_NUMBER|'$BUILD_NUMBER_NEW'|g' \
    -e 's|BUILD_GITHUB_PATH|'$BUILD_GITHUB_PATH'|g' $WHEREIAM/src/manifest.json > $WHEREIAM/docs/manifest.json

    # serviceworker.js update version tags
    sed -e 's|BUILD_NUMBER|'$BUILD_NUMBER_NEW'|g' \
    -e 's|BUILD_GITHUB_PATH|'$BUILD_GITHUB_PATH'|g' $WHEREIAM/src/serviceworker.js > $WHEREIAM/docs/serviceworker.js

    echo "PWA version updated from $BUILD_NUMBER_OLD to $BUILD_NUMBER_NEW"
    
    echo $BUILD_NUMBER_NEW > $WHEREIAM/VERSION
    echo "VERSION file updated from $BUILD_NUMBER_OLD to $BUILD_NUMBER_NEW"

else

    echo "sed command not found"

fi

# copy assets folder into docs folder
yes | cp -vr $WHEREIAM/src/assets $WHEREIAM/docs

echo "Assets folders copy action finished"