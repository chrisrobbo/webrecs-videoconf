#!/bin/bash
#DISPLAY=:0 ../jibri-xmpp-client/jibriselenium.py -u http://jitsi.hosts.webrecs.com/$1 
DISPLAY=:0 ../jibri-xmpp-client/jibriselenium.py -u http://jitsi.hosts.webrecs.com/$1#config.iAmRecorder=true\&config.externalConnectUrl=null\&config.hosts.domain=recorder.jitsi.hosts.webrecs.com 


