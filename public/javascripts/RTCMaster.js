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

            applyButton.onclick = function() {
                try{
                    video.attr('width', widthInput.val());
                    video.attr('height', heightInput.val());
                } catch ( e ) {
                    console.error(e.message);
                }
            };

            connectToServer();
            function connectToServer() {
                var masterId = '0';
                var slaves = {};
                var slavesList = $('#slavesList');

                function onClickSlave(id) {
                    if( slaves[id].stream ) {
                        video.attr('src', slaves[id].stream);
                    } else {
                        statusBar.text("Stream doesn't exist");
                    }
                }

                function addSlave(id) {
                    slaves[id] = {
                        name: "",
                        stream: null
                    };
                    slavesList.append( '<li id="' + id + '"></li>' );
                    var li = $('#'+id);
                    li.text(id);
                    li.click(function(){
                        onClickSlave(id);
                    });
                }

                function addStreamToSlave(id, stream) {
                    slaves[id].stream = stream;
                    $('#'+id).addClass('alert alert-success');
                }
                function addNameToSlave(id, name) {
                    slaves[id].name = name;
                    $('#'+id).text(name);
                }

                function removeSlave(id) {
                    $('#'+id).remove();
                    delete slaves[id];
                }

                var peer = new Peer(masterId, {host: 'localhost', port: 3002, path: '/server'});
                statusBar.text("Connecting to server...");
                peer
                    .on('open', function (id) {
                        statusBar.text("Connected to server. Your id's " + id);
                    })
                    .on('close', function () {
                        statusBar.text("Disconnected from server");
                    })
                    .on('connection', function (conn) {

                        console.log(conn.peer);

                        addSlave( conn.peer );

                        conn
                            .on('data', function (data) {
                                addNameToSlave(conn.peer, data);
                                statusBar.text(data + " connected");
                            })

                            .on('close', function() {
                                statusBar.text((slaves[conn.peer].name || conn.peer) + " disconnected");
                                removeSlave(conn.peer);
                            });
                    })
                    .on('error', function (err) {
                        console.error(err);
                        statusBar.text("Cannot connect");
                    })
                    .on('call', function(call) {
                        statusBar.text(slaves[call.peer].name + " sees us...");
                        call.answer(mediaStream);

                        call.on('stream', function(stream){
                            statusBar.text((slaves[call.peer].name || call.peer) + " gives stream");
                            addStreamToSlave( call.peer, URL.createObjectURL(stream) );
                        })
                    });
            }
        },
        function(err) {
            console.error(err);
        }
    );
})();

