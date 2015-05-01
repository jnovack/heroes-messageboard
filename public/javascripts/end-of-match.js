var socket = io();

socket.on('connect', function() {
    socket.emit('join', 'end-of-match');
});

socket.on('reload', function(data){
    console.log("reloading...");
    location.reload();
});

socket.on('action', function(data) {
    console.log(data);
    if (data.action == 'ignore') {
        $("#"+data.id).attr('data-ignore', data.value);
    }
    if (data.action == 'visible') {
        $("#"+data.id).attr('data-visible', data.value);
        if (data.value == 'hide') {
            $("#"+data.id).fadeOut();
        }
        if (data.value == 'show') {
            $("#"+data.id).fadeIn();
        }
    }
});

socket.on('value', function(data) {
    console.log(data);
    updateValue(data.id, data.text);
});


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

function updateValue(id, value) {
    console.log("updateValue: " + id + " - " + value);

    if ($("#"+id).is("div")) {
        $("#"+id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass("animated bounceIn");
        });
    }

    if ($("#"+id).is("input")) {
        $("#"+id).val(value);
    }

    if ($("#"+id).hasClass("value")) {
        $("#"+id).text(value).addClass("animated bounceIn");
    }

    if ($("#"+id).hasClass("text")) {
        $("#"+id).text(value).addClass("animated bounceIn");
    }

    if ($("#"+id).hasClass("html")) {
        $("#"+id).html(value).addClass("animated bounceIn");
    }

    if ($("#"+id).hasClass("divimage")) {
        replaceClass("divimage-"+value, id);
        $("#"+id).addClass("animated bounceIn");
    }
}
