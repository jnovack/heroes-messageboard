var socket = io();

socket.on('reload', function(data){
    console.log("reloading...");
    location.reload();
});

socket.on('title', function(data) {
    console.log("title: " + data.text);
    $("#mainview_header_title").html(data.text);
    $("#mainview_header_title").addClass("animated bounceIn");
});

socket.on('subtitle', function(data) {
    console.log("subtitle: " + data.text);
    $("#mainview_header_subtitle").html(data.text);
    $("#mainview_header_subtitle").addClass("animated bounceIn");
});

socket.on('rank', function(data) {
    console.log("rank: " + data.text);
    $("#sidebar_footer_text").html(data.text);
    $("#sidebar_footer_text").addClass("animated bounceIn");

});

socket.on('hide-messages', function(data) {
    $("#mainview_body").fadeOut();
});

socket.on('show-messages', function(data) {
    $("#mainview_body").fadeIn();
});

var redgreen = "color-green color-greener color-greenest color-red color-redder color-reddest";

socket.on('action', function(data) {
    console.log(data);
    if (data.action == 'ignore') {
        $("#"+data.id).attr('data-ignore', data.value);
    }
    if (data.action == 'visible') {
        $("#"+data.id).attr('data-visible', data.value);
        if (data.value == 'hide') {
            $("#"+data.id).hide();
        }
        if (data.value == 'show') {
            $("#"+data.id).show();
        }
    }
    if (data.action == 'class') {
        var classNames = $("#"+data.id).attr("class").toString().split(' ');
        $.each(classNames, function (i, className) {
            if (className.indexOf('-') > 0 && data.value.indexOf('-') > 0) {
                if (className.substring(0, className.indexOf('-')) == data.value.substring(0, data.value.indexOf('-'))) {
                    $("#"+data.id).removeClass(className);
                }
            }
        });
        $("#"+data.id).addClass(data.value);
    }
    // Fire off any additional specialized components
    $("#"+data.id).trigger('changeData');
});


socket.on('value', function(data) {
    console.log(data);

    if ($("#"+data.id).text() != data.text) {
        $("#"+data.id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass("animated bounceIn");
        });

        if ($("#"+data.id).hasClass("value")) {
            $("#"+data.id).text(data.text).addClass("animated bounceIn");
        }

        if ($("#"+data.id).hasClass("text")) {
            $("#"+data.id).text(data.text).addClass("animated bounceIn");
        }

        if ($("#"+data.id).hasClass("divimage")) {
            $("#"+data.id).removeClass().addClass("animated bounceIn divimage divimage-"+data.text);
        }

        if ($("#"+data.id).hasClass("linked-picture")) {
            $("#"+data.id).text(properName(data.text)).addClass("animated bounceIn");
            $("#"+data.id.substring(0, data.id.indexOf('-'))+"-picture").removeClass().addClass("animated bounceIn divimage divimage-"+data.text);
            $("#"+data.id.substring(0, data.id.indexOf('-'))+"-picture").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass("animated bounceIn");
            });
        }

        if ($("#"+data.id).hasClass("progress-bar")) {
            $("#"+data.id).css("width", data.text + "%");
        }

        if ($("#"+data.id).hasClass("video")) {
            $("#sidebar_header_video").attr('src', "assets/hero-videos/"+data.text+".webm").removeClass().addClass("video " + data.text);
        }

        if ($("#"+data.id).hasClass("percent")) {
            if  (data.text  < 40) { $("#"+data.id).removeClass(redgreen).addClass("color-reddest"); }
            if ((data.text >= 40) && (data.text < 45)) { $("#"+data.id).removeClass(redgreen).addClass("color-redder"); }
            if ((data.text >= 45) && (data.text < 50)) { $("#"+data.id).removeClass(redgreen).addClass("color-red"); }
            if ((data.text >= 50) && (data.text < 55)) { $("#"+data.id).removeClass(redgreen).addClass("color-green"); }
            if ((data.text >= 55) && (data.text < 60)) { $("#"+data.id).removeClass(redgreen).addClass("color-greener"); }
            if  (data.text >= 60) { $("#"+data.id).removeClass(redgreen).addClass("color-greenest"); }

            $("#"+data.id).text(data.text).addClass("animated bounceIn");
        }

        if ($("#"+data.id).hasClass("ratio")) {
            var group = $("#"+data.id).attr('data-group');
            var total = 0;
            $.each( $("[data-group='"+group+"']"), function(id, value) {
                total += parseInt($(value).text());
            });
            var percent = data.text*100/total;
            if  (percent  < 10) { $("#"+data.id).removeClass(redgreen).addClass("color-reddest"); }
            if ((percent >= 10) && (percent < 17)) { $("#"+data.id).removeClass(redgreen).addClass("color-redder"); }
            if ((percent >= 17) && (percent < 25)) { $("#"+data.id).removeClass(redgreen).addClass("color-red"); }
            if ((percent >= 25) && (percent < 33)) { $("#"+data.id).removeClass(redgreen).addClass("color-green"); }
            if ((percent >= 33) && (percent < 40)) { $("#"+data.id).removeClass(redgreen).addClass("color-greener"); }
            if  (percent >= 40) { $("#"+data.id).removeClass(redgreen).addClass("color-greenest"); }

            $("#"+data.id).text(data.text).addClass("animated bounceIn");
        }

    }
});

function properName(hero) {
    if (hero.indexOf('_') > 0) {
        hero = hero.substring(0, hero.indexOf('_'));
    }
    switch (hero) {
        case 'anubarak':
            return "Anub'arak";
            break;
        case 'etc':
            return "ETC";
            break;
        case 'lili':
            return "Li Li";
            break;
        case 'sgt-hammer':
            return "Sgt. Hammer";
            break;
        case 'the-lost-vikings':
            return "The Lost Vikings";
            break;
        default:
            return hero.charAt(0).toUpperCase()+hero.substr(1).toLowerCase();
    }
}
