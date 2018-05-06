#!/bin/bash
#######################################################
#  Webrecs (c) 2018
#
#  finalize_recording.sh copies recorded mp4 files to the appropriate server and site on a Webrecs system before deleting the files locally
#
#  It takes 3 parameters , the recording root (nom "recordings" ) , the archive server prefix which is the first part of the Webrecs server name
#  (minus the hosts.webrecs.com) and the (optional) -c for cleanup which not only removes the files but also the directory structure 
#
#  The script relies on the fact that the recordings are saved in folders derived from the room name which contains the Webrecs server
#  according to the convention server!site!room
#
#  The username/login for the archive server are given by the jibri .netrc machine <name> user <user> password <password> 
#########################################################################
[ $# -lt 2 ] && echo "Error : Not enough params " && exit 1
RECORDING_PATH="$1"
ARCHIVE_SERVER="$2" #myserver.hosts.webrecs.com
ARCHIVE_SERVER_PREFIX=${ARCHIVE_SERVER%%.*} #myserver
#[ -z "$RECORDING_PATH" ] && RECORDING_PATH="./recordings"
LPATHS=""
ROOT_DIR=`find  $RECORDING_PATH -type d -name $ARCHIVE_SERVER_PREFIX*` 
[ $? -gt 0 ] && echo "Error : Can't find ROOT_DIR $ROOT_DIR " && exit 1
SITE=${ROOT_DIR#$RECORDING_PATH}
SITE=`echo $SITE | cut -d'!' -f2`
for file in $(find $ROOT_DIR -type f -name "*.mp4" ); do
    curlcmd="curl -POST  -w "status:%{http_code}" -s -n https://$ARCHIVE_SERVER/alfresco/service/api/upload -F filedata=@$file -F siteid=$SITE -F containerid=documentLibrary -F uploaddirectory=Recordings" # -n for .netrc 
    echo $curlcmd
    res=`${curlcmd}`
    echo $res
    ret=`echo $res  | sed s/.*status://g`
    if [ $ret -ne 200 ]; then 
	exit $ret 
    else 
        echo "removing $file"
        rm $file
    fi
done

#now cleanup room directory if -c flag
if [ "$3_" == "-c_" ]; then
        rmdir  $ROOT_DIR
fi
