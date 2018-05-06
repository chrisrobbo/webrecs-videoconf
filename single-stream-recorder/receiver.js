// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Note: |window.currentStream| was set in background.js.

// Stop video play-out, stop the MediaStreamTracks, and set style class to
// "shutdown".
  ///Jitsi stuff
console.log("Start of JS");
 const options = {
		    hosts: {
		        domain: 'jitsi.hosts.webrecs.com',
		        muc: 'conference.jitsi.hosts.webrecs.com' // FIXME: use XEP-0030
		    },
		    bosh: '//jitsi.hosts.webrecs.com/http-bind', // FIXME: use xep-0156 for that


		    // The name of client node advertised in XEP-0115 'c' stanza
		    clientNode: 'http://jitsi.org/jitsimeet'
		};

		const confOptions = {
		    openBridgeChannel: true
		};

		let connection = null;
		let isJoined = false;
		let room = null;

		/**
		 * That function is executed when the conference is joined
		 */
		function onConferenceJoined() {
		    console.log('conference joined!');
		    isJoined = true;
		    var tracks = window.currentStream.getTracks();
		    for (var i = 0; i < tracks.length; ++i) {
			    room.addTrack(tracks[i]);
		        console.log('MediaStreamTrack[' + i + '] added');
		      };
		}

		
		
		/**
		 * That function is called when connection is established successfully
		 */
		function onConnectionSuccess() {
		    room = connection.initJitsiConference('norbert', confOptions);
		    room.on(
		        JitsiMeetJS.events.conference.CONFERENCE_JOINED,
		        onConferenceJoined);
		    room.join();
		}
		/**
		 * This function is called when the connection fail.
		 */
		function onConnectionFailed() {
		    console.error('Connection Failed!');
		}

		/**
		 * This function is called when we disconnect.
		 */
		function disconnect() {
		    console.log('disconnect!');
		    connection.removeEventListener(
		        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
		        onConnectionSuccess);
		    connection.removeEventListener(
		        JitsiMeetJS.events.connection.CONNECTION_FAILED,
		        onConnectionFailed);
		    connection.removeEventListener(
		        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
		        disconnect);
		}
		
		function unload() {
		    room.leave();
		    connection.disconnect();
		}

		const initOptions = {
			    disableAudioLevels: true
			};




function shutdownReceiver() {
	  unload(); //jitsi 
	  
  if (!window.currentStream) {
    return;
  }

  var player = document.getElementById('player');
  player.src = '';
  var tracks = window.currentStream.getTracks();
  for (var i = 0; i < tracks.length; ++i) {
    tracks[i].stop();
  }
  window.currentStream = null;

  document.body.className = 'shutdown';
  
}

window.addEventListener('load', function() {
	  //Load Jitsi
	console.log("Start of load callback");

	JitsiMeetJS.init(initOptions)
    .then(() => {
       connection = new JitsiMeetJS.JitsiConnection(null, null, options);
	    console.log('Got connection' + connection);

        connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
            onConnectionSuccess);
        connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_FAILED,
            onConnectionFailed);
        connection.addEventListener(
            JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
            disconnect);
	    console.log('Connecting to jitsi server ....');

        connection.connect();
    })
        .catch(error => console.log(error));
	
  // Start video play-out of the captured audio/video MediaStream once the page
  // has loaded.
  var player = document.getElementById('player');
  player.addEventListener('canplay', function() {
    this.volume = 0.75;
    this.muted = false;
    this.play();
  });
  player.setAttribute('controls', '1');
  player.src = URL.createObjectURL(window.currentStream);

  
  
  
  
  
  // Add onended event listeners. This detects when tab capture was shut down by
  // closing the tab being captured.
  var tracks = window.currentStream.getTracks();
  for (var i = 0; i < tracks.length; ++i) {
    tracks[i].addEventListener('ended', function() {
      console.log('MediaStreamTrack[' + i + '] ended, shutting down...');
      shutdownReceiver();
    });
  }
  



});

// Shutdown when the receiver page is closed.
window.addEventListener('beforeunload', shutdownReceiver);
