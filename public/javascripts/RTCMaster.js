/**
 * Created by vasiliy.lomanov on 14.07.2014.
 */



(function(){

    var media = new Media(
        function(mediaStream) {
            var masterId = '0';

            var idsList = document.getElementById('idsList');

            var streams = {};
            var peer = new Peer(masterId, {host: 'localhost', port: 3002, path: '/server'});

            peer
                .on('open', function(id) {
                    console.log('My peer ID is: ' + id);

                    peer.on('connection', function(conn) {
                        console.log(conn.peer + " connected");
                        conn.on('open', function() {});

                        {
                            var newDiv = document.createElement('li');
                            newDiv.innerHTML = '<a tabindex="-1" href="#">' + conn.peer + '</a>';
                            idsList.appendChild(newDiv);
                        }

                        peer.on('call', function(call) {
                            console.log("called");
                            // Answer the call, providing our mediaStream
                            call.answer(mediaStream);

                            call.on('stream', function(stream){
                                var video = document.getElementById('video');

                                video.src = URL.createObjectURL(stream);
                                //
                                streams[conn.peer] = stream;
                            });

                        });
                    })

                })
                .on('close', function() {
                    console.log('closed');
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

