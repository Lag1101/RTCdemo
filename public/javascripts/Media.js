/**
 * Created by vasiliy.lomanov on 14.07.2014.
 */

var Media = (function(){



    function Media(onSuccess, onError) {
        this.onSuccess = onSuccess;
        this.onError = onError;

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia({audio: true, video: true},
            this.onSuccess,
            this.onError
        );

        function setDimensions() {
            var width = parseInt( document.getElementById("width").value , 10);
            var height = parseInt( document.getElementById("width").value , 10);

            var video = document.getElementById("video");
            video.width = width;
            video.height = height;
        }

        setDimensions();
        document.getElementById("apply").onclick = setDimensions;

    }

    return Media;

})();