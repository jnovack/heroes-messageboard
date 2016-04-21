var socket = io(document.location.origin+'/messageboard');

socket.on('joined', function(data){
    console.log("socket/messageboard - joined " + data);
});

socket.on('reload', function(data){
    console.log("socket/messageboard - reloading...");
    location.reload();
});

socket.on('log', function(data) {
    console.log(data);
});
