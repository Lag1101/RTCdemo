/**
 * Created by vasiliy.lomanov on 14.07.2014.
 */
function Media(onSuccess, onError) {
    navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
    );
    navigator.getUserMedia({audio: true, video: true},
        onSuccess,
        function(err) {
            onError(err);
        }
    );
}