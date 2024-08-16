#!/bin/bash

# Before run: chmod a+x upload.sh

# Local Variables
WHEREIAM=$(pwd)

cd ./data

echo "Bootstrap build started"

if [ -d "$WHEREIAM/data/bootstrap/" ]; then
    echo "Bootstrap folder exists."
else
    echo "Bootstrap folder not exists."

    echo "Bootstrap repo cloned from github."
    git clone https://github.com/twbs/bootstrap.git
fi

cd bootstrap && npm run css && cp ./dist/css/bootstrap.min.css ../../src/assets/css
cd ..

echo "Bootstrap build finished"
echo "------------------------"


echo "Icons build started"

if [ -d "$WHEREIAM/data/icons/" ]; then
    echo "Icons folder exists."
else
    echo "Icons folder not exists."

    echo "Icons repo cloned from github."
    git clone https://github.com/twbs/icons.git
fi

cd icons && npm run go && cp -r font/fonts ../../src/assets/css/ && cp font/bootstrap-icons.min.css ../../src/assets/css/
cd ..

echo "Icons build finished"
echo "------------------------"


echo "Alpinejs build started"

if [ -d "$WHEREIAM/data/alpine/" ]; then
    echo "Alpinejs folder exists."
else
    echo "Alpinejs folder not exists."

    echo "Alpinejs repo cloned from github."
    git clone https://github.com/alpinejs/alpine.git
fi

cd alpine && npm run build
cp packages/csp/dist/cdn.min.js ../../src/assets/js/csp.alpine.min.js 
cp packages/mask/dist/cdn.min.js ../../src/assets/js/mask.alpine.min.js
cp packages/sort/dist/cdn.min.js ../../src/assets/js/sort.alpine.min.js
cp packages/persist/dist/cdn.min.js ../../src/assets/js/persist.alpine.min.js
cd ..

echo "Alpinejs build finished"
echo "------------------------"
