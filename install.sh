#!/bin/bash

#Sysupdate
apt update
#!/usr/bin/env bash
print_title() {
        BOLD=$(tput bold ; tput setaf 2)
        NORMAL=$(tput sgr0)
        echo "${BOLD} $1 ${NORMAL}"
}

# if ! [ -x "$(command -v git)" ]; then
#   echo 'Error: git no ha sido instalado.' >&2
#   exit 1
# fi

#Install Node Js
if ! [ -x "$(command -v npm)" ]; then
    print_title "[~] Instalando NodeJS ..."
    apt install curl
    apt-get install curl software-properties-common
    curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
    apt-get install -y nodejs
    apt-get install gcc g++ make
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    apt-get update && sudo apt-get install yarn
    apt-get install npm
    
else
    print_title "[+] NodeJS está instalado"
fi 

print_title "[~] Instalando paquetes necesarios"
#dependencias node
npm install
#dependencias minimist
npm install minimist
#dependencia cloudscraper
npm install cloudscraper

print_title "[~] Los paquetes han sido instalados"

