#!/bin/bash


if which node > /dev/null
    then
        echo "node is installed, skipping..."

version=$(node -v | cut -d '.' -f 1)

if [ "$version" == "v10" ] 
 then
        echo "Nodejs version checked"

if service mongod status >/dev/null; 
then
   echo "mongodb checked"

npm install
npm audit fix

node readme/install.js

# databasename
read -p "Enter Your DB Name: "  database
sed -i "s/value1/$database/g" .env
# username
read -p "Enter Your DB User: "  username
sed -i "s/value2/$username/g" .env
# password
read -p "Enter Your DB Password: "  password
sed -i "s/value3/$password/g" .env
# port
read -p "Enter Your Port: "  port
sed -i "s/value4/$port/g" .env

# databasename
read -p "Enter Your Admin User Name: "  adminuser
sed -i "s/value5/$adminuser/g" .env
# databasename
read -p "Enter Your Admin Email: "  adminemail
sed -i "s/value6/$adminemail/g" .env
# databasename
read -p "Enter Your Admin User Password: "  adminpassword
sed -i "s/value7/$adminpassword/g" .env
# databasename
read -p "Enter Your Site Name: "  sitename
sed -i "s/value8/$sitename/g" .env
# databasename
read -p "Enter Your Site Url(EX: yourdomainname.com): "  siteurl
sed -i "s/value9/$siteurl/g" .env

# Service

 npm install pm2 -g

 npm run deploy

echo "Passup installed Sucessfully."

else 
	echo "MongoDB not installed"
fi


  else
        echo "Upgrade"
fi
    else
        echo "node.js not installed on your server"
    fi





