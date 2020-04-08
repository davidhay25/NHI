#!/bin/bash

echo "Applying IG fix..."
./fixIG.js

echo "Fix complete.."

set -e
java -jar input-cache/org.hl7.fhir.publisher.jar -ig ig.ini -t https://r4.ontoserver.csiro.au/fhir/

echo "zipping output..."

cd ~/IG/NHI/shorthand/build/output

zip -r -X archive.zip . > /dev/null



while true; do
    read -p "Do you wish to upload the zipped output to the server? " yn
    case $yn in
        [Yy]* ) scp ~/IG/NHI/shorthand/build/output/archive.zip root@igs.clinfhir.com:/var/www/nhi; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done