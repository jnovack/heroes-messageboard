var socket = io();

function replaceClass(classLike, id) {
    var classNames = $("#"+id).attr("class").toString().split(' ');
    var prefix = classLike.substring(0, classLike.indexOf('-'));
    $.each(classNames, function (i, className) {
        if (className.indexOf(prefix) == 0 && className.indexOf('-') > 0) {
            $("#"+id).removeClass(className);
        }
    });
    $("#"+id).addClass(classLike);
}

socket.on('connect', function() {
    socket.emit('join', 'end-of-match');
});

socket.on('reload', function(data){
    console.log("reloading...");
    location.reload();
});

socket.on('value', function(data) {
    console.log(data);

        $("#"+data.id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass("animated bounceIn");
        });

        if ($("#"+data.id).hasClass("value")) {
            $("#"+data.id).text(data.text).addClass("animated bounceIn");
        }

        if ($("#"+data.id).hasClass("text")) {
            $("#"+data.id).text(data.text).addClass("animated bounceIn");
        }

        if ($("#"+data.id).hasClass("html")) {
            $("#"+data.id).html(data.text).addClass("animated bounceIn");
        }

        if ($("#"+data.id).hasClass("divimage")) {
            replaceClass("divimage-"+data.text, data.id);
            $("#"+data.id).addClass("animated bounceIn");
        }

});
