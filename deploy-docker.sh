#!/bin/bash
#docker image for passup
sudo docker pull sysad25/passup:1.2

if [[ $(which docker) && $(docker --version) ]]; then
  echo "Docker installed"
  # datase from user

  # databasename
read -p "Enter Your DB Name: "  database
sed -i "s/value1/$database/g" .env.staging
sed -i "s/value1/$database/g" mongo-compose.yml

# username
read -p "Enter Your DB User: "  username
sed -i "s/value2/$username/g" .env.staging
sed -i "s/value2/$username/g" mongo-compose.yml

# password
read -p "Enter Your DB Password: "  password
sed -i "s/value3/$password/g" .env.staging
sed -i "s/value3/$password/g" mongo-compose.yml

# port
read -p "Enter Your Port: "  port
sed -i "s/value4/$port/g" .env.staging

# databasename
read -p "Enter Your Admin User Name: "  adminuser
sed -i "s/value5/$adminuser/g" .env.staging
# databasename
read -p "Enter Your Admin Email: "  adminemail
sed -i "s/value6/$adminemail/g" .env.staging
# databasename
read -s -p "Enter Your Admin User Password: "  adminpassword
sed -i "s/value7/$adminpassword/g" .env.staging
# databasename
read -p "Enter Your Site Name: "  sitename
sed -i "s/value8/$sitename/g" .env.staging
# databasename
read -p "Enter Your Site Url(EX: yourdomainname.com): "  siteurl
sed -i "s/value9/$siteurl/g" .env.staging

sudo docker pull mongo
sudo docker-compose -f mongo-compose.yml up -d 
echo "MongoDB creating Please wait..."
sleep 30s
sudo docker run --name passup --link mongodb --network passup_passup -d -p 4000:4000 sysad25/passup:1.2
echo "Passup Installed Successfully."
else
  echo "Docker Missing..."
  # command
fi
