/**
 * Created by vasiliy.lomanov on 14.07.2014.
 */



(function(){

    var media = new Media(
        function(mediaStream) {

            var masterId = '0';

            var callButton = document.getElementById('callBtn');

            var peer = new Peer({host: 'localhost', port: 3002, path: '/server'});

            function onClickCall() {
                var call = peer.call(masterId, mediaStream);

                call.on('stream', function(stream) {
                    // `stream` is the MediaStream of the remote peer.
                    // Here you'd add it to an HTML video/canvas element.
                    console.log('call done');

                    var video = document.getElementById('video');
                    video.src = URL.createObjectURL(stream);
                    video.muted = true;
                });
            }

            callButton.onclick = onClickCall;

            peer
                .on('open', function(id) {
                    console.log('My peer ID is: ' + id);
                    var conn = peer.connect(masterId);

                    conn.on('open', function() {
                        console.log(" connected");
                        callButton.disabled = false;
                        // Receive messages
                    });

                })
                .on('close', function() {
                    console.log('closed');
                    callButton.disabled = true;
                })
                .on('connection', function(conn) {
                    console.log(conn.peer);
                    conn.on('open', function() {});
                })
                .on('error', function(err) {
                    console.error(err);
                });
        },
        function(err) {
            console.error(err);
        }
    );

})();

