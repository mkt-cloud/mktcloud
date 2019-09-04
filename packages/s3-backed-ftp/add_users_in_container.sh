#!/bin/bash
# This script will update the env.list file (file containing USERS environrment variable) and add the new users if there are any.
# Will check for new users at a given time interval (change sleep duration on line 33)

SLEEP_DURATION=5
# Change theses next two variables to set different permissions for files/directories
# These were default from vsftpd so change accordingly if necessary
FILE_PERMISSIONS=644
DIRECTORY_PERMISSIONS=755

FTP_DIRECTORY="/home"

add_users() {
  USERS=$(mongo "$MONGO_CONNECTION_STRING" --username "$MONGO_USERNAME" --password "$MONGO_PASSWORD" --quiet --eval 'DBQuery.shellBatchSize = 5000; db.camera.find({status: 200}, {"ftpUser": 1, "ftpPass": 1, "_id": 0})' | grep '^{' | jq -s '.[]|join(":")' | tr '\n' ' ' | tr -d '"' | sed 's/^[ \t]*//;s/[ \t]*$//')
  for u in $USERS; do
    read username passwd <<< $(echo $u | sed 's/:/ /g')

    # If account exists set password again 
    # In cases where password changes in env file
    if getent passwd "$username" >/dev/null 2>&1; then
      echo $u | chpasswd

    #   # Search for files and directories not owned correctly
      find "$FTP_DIRECTORY"/"$username"/* \( \! -user "$username" \! -group "$username" \) -print0 | xargs -0 chown "$username:$username"

    #   # Search for files with incorrect permissions
      find "$FTP_DIRECTORY"/"$username"/* -type f \! -perm "$FILE_PERMISSIONS" -print0 | xargs -0 chmod "$FILE_PERMISSIONS"

    #   # Search for directories with incorrect permissions
      find "$FTP_DIRECTORY"/"$username"/* -type d \! -perm "$DIRECTORY_PERMISSIONS" -print0 | xargs -0 chmod "$DIRECTORY_PERMISSIONS"
    fi

    # If user account doesn't exist create it 
    # As well as their home directory 
    if ! getent passwd "$username" >/dev/null 2>&1; then
       adduser "$username" --gecos "" --disabled-password --shell /usr/sbin/nologin --force-badname
       echo $u | chpasswd
     fi
   done
}

 while true; do
   sleep $SLEEP_DURATION
   add_users
 done
