#!/bin/bash
#Sysupdate
sudo apt-get update

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
    print_title "[~] Install NodeJS ..."
    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_title "[+] NodeJS esta instalado"
fi 

print_title "[~] Instalando otros requerimientos necesarios"
#dependencias node
sudo npm install
#dependencias minimist
sudo npm install minimist
#dependencia cloudscraper
npm install cloudscraper

print_title "[~] Los paquetes han sido instalados"


