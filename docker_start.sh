#!/bin/bash

if [ "$PIPELINE" == "true" ]
then
    #Enable ssh usage in the container
    eval "$(ssh-agent -s)"
    echo -e "StrictHostKeyChecking no" >> /etc/ssh/ssh_config
    ssh-add ../data/ssh/id_rsa
    #initialize, generate and publish
    npm run init
    npm run compile
    npm run preparePushResult
    npm run pushResult
else
    sh
fi
