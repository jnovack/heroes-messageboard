var socket = io();

socket.on('joined', function(data){
    console.log("joined " + data);
});

socket.on('log', function(data) {
    console.log(data);
});
