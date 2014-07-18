/**
 * Created by vasiliy.lomanov on 14.07.2014.
 */



(function(){
    var statusBar = $('#state');

    Media(
        function(mediaStream) {
            var applyButton = $('#apply');
            var widthInput = $('#width');
            var heightInput = $('#height');
            var video = $('#video');

            applyButton.attr('disabled', false);
            widthInput.attr('disabled', false);
            heightInput.attr('disabled', false);

            applyButton.click( function() {
                try{
                    video.attr('width', widthInput.val());
                    video.attr('height', heightInput.val());
                } catch ( e ) {
                    console.error(e.message);
                }
            });

            var connButton = $('#connect');
            connButton.attr('disabled', false);
            connectToServer();
            function connectToServer() {
                connButton.click(null);
                var peer = new Peer({host: window.location.hostname, port: 3002, path: '/server'});
                statusBar.text("Connecting to server...");
                peer
                    .on('open', function (id) {
                        connButton.click(connectToServer);
                        statusBar.text("Connected to server. Your id's " + id);

                        var callButton = $('#call');
                        var sendButton = $('#send');
                        var loginEl = $('#login');

                        var masterId = '0';
                        var conn = peer.connect(masterId);
                        statusBar.text("Connecting to Master...");
                        conn
                            .on('open', function () {
                                statusBar.text("Connected to Master");

                                callButton.attr('disabled', false);
                                loginEl.attr('disabled', false);
                                sendButton.attr('disabled', false);
                                callButton.click( function () {
                                    var call = peer.call(masterId, mediaStream);

                                    statusBar.text("Calling to Master...");
                                    call.on('stream', function (stream) {
                                        statusBar.text("Call established");
                                        console.log('call done');

                                        video.attr('src', window.URL.createObjectURL(stream));
                                        video.attr('muted', true);
                                    });
                                });
                                sendButton.click( function() {
                                    conn.send(loginEl.val());
                                });
                            })
                            .on('close', function () {
                                statusBar.text("Disconnected from Master");
                                callButton.attr('disabled', true);
                                loginEl.attr('disabled', true);
                                sendButton.attr('disabled', true);
                            });
                    })
                    .on('close', function () {
                        statusBar.text("Disconnected from server");
                    })
                    .on('connection', function (conn) {
                        console.log(conn.peer);
                        conn.on('open', function () {});
                    })
                    .on('error', function (err) {
                        console.error(err);
                        statusBar.text("Cannot connect");
                    });
            }
        },
        function(err) {
            console.error(err);
        }
    );
})();

