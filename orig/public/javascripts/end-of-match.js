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
    if (data.action == 'class') {
        replaceClass(data.value, data.id);
    }
    // Trigger any follow up actions
    $('#'+data.id).trigger('trigger', data);
});

socket.on('value', function(data) {
    updateValue(data.id, data.text);
});


$("[role='trigger']").on('trigger', function(event, data) {
    var elements = $(this).attr('data-trigger');

    if (elements == "team-scores") {
        $('#team1-score').text($("[data-group='game-heroes'][data-team='team1'].game-winner").size());
        $('#team2-score').text($("[data-group='game-heroes'][data-team='team2'].game-winner").size());
    }
    if (elements == "picture") {
        replaceClass('divimage-'+data,$(this).attr('id') + '-picture');
    }
});


function replaceClass(classLike, id) {
    var classNames = $("#"+id).attr("class").toString().split(' ');
    var prefix = classLike.substring(0, classLike.indexOf('-'));
    $.each(classNames, function (i, className) {
        if (className.indexOf(prefix) === 0 && className.indexOf('-') > 0) {
            $("#"+id).removeClass(className);
        }
    });
    $("#"+id).addClass(classLike);
}

function updateValue(id, value) {
    console.log("updateValue: " + id + " - " + value);

    if (typeof $('#'+id).prop('type') !== "undefined") {
        // Admin page with inputs
        switch ($('#'+id).prop('type')) {
            case "text":
                $("#"+id).val(value);
                break;
            case "select-one":
                $('#'+id + ' option[value="' + value + '"]').prop('selected', true);
                $('#'+id).trigger('trigger', value);
                break;
            default:
                console.log($('#'+id).prop('type'));
        }
    } else {
        // Viewer page with divs
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
}
